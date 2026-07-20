import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
	CreateVacancyDto,
	CreateVacancyListDto,
	CreateVacancyResponse,
	VacancySource,
} from './vacancy.types';
import { Vacancy } from './entities/vacancy.entity';
import { TelegramService } from '@/telegram/telegram.service';

@Injectable()
export class VacancyService {
	constructor(
		@InjectRepository(Vacancy)
		private readonly vacancyRepository: Repository<Vacancy>,
		private readonly telegramService: TelegramService,
	) {}

	async getById(vacancyId: number): Promise<Vacancy> {
		const vacancy = await this.vacancyRepository.findOneBy({
			id: String(vacancyId),
		});
		if (!vacancy) {
			throw new NotFoundException(`Vacancy ${vacancyId} not found`);
		}
		return vacancy;
	}

	/**
	 * Returns a page of vacancies from public.vacancy.
	 * @param pageSize N — items per page (25 | 50 | 100)
	 * @param page M — 1-based page number
	 * @param source optional filter by source (hh | habr)
	 */
	async getAllVacancies(
		pageSize: number,
		page: number,
		source?: VacancySource,
	): Promise<Vacancy[]> {
		const offset = (page - 1) * pageSize;
		return this.vacancyRepository.find({
			where: source ? { source } : undefined,
			skip: offset,
			take: pageSize,
			order: { id: 'DESC' },
		});
	}

	/**
	 * Creates only vacancies that do not already exist.
	 * Uniqueness key: (id_ext, source, title).
	 */
	async create(vacListDto: CreateVacancyListDto): Promise<CreateVacancyResponse> {
		const incoming = vacListDto.vacancyList.map((vac) => ({
			...vac,
			id_ext: String(vac.id_ext),
			date_fetched: new Date(),
		}));

		const vacancyKey = (v: { id_ext: string; source: string; title: string }) =>
			`${v.id_ext}\0${v.source}\0${v.title}`;

		const existing = await this.vacancyRepository.find({
			where: incoming.map((v) => ({
				id_ext: v.id_ext,
				source: v.source,
				title: v.title,
			})),
			// select: ['id_ext', 'source', 'title'],
		});
		const existingKeys = new Set(existing.map(vacancyKey));

		const seenInBatch = new Set<string>();
		const toCreate = incoming.filter((v) => {
			const key = vacancyKey(v);
			if (existingKeys.has(key) || seenInBatch.has(key)) {
				return false;
			}
			seenInBatch.add(key);
			return true;
		});

		if (toCreate.length === 0) {
			return {
				result: 'CREATED',
				vacancyList: [],
			};
		}

		const createResult = this.vacancyRepository.create(toCreate);
		const saveResult = await this.vacancyRepository.save(createResult, {
			chunk: 10,
		});

		// Notify only for new vacancies (non-blocking; keep response fast)
		this.notifyNewVacancies(toCreate);

		return {
			result: 'CREATED',
			vacancyList: saveResult.map((vac) => {
				const { id, id_ext, title } = vac;
				return { id, id_ext, title };
			}),
		};
	}

	/** Fire-and-forget Telegram notifications for newly created vacancies. */
	private notifyNewVacancies(vacancies: Array<CreateVacancyDto & { id_ext: string }>): void {
		void (async () => {
			for (const vac of vacancies) {
				try {
					await this.telegramService.sendRequestNotification(vac);
					// light spacing to avoid Telegram rate limits
					await new Promise((resolve) => setTimeout(resolve, 2000));
				} catch (err) {
					console.error('Ошибка отправки в Telegram:', err);
				}
			}
		})();
	}
}

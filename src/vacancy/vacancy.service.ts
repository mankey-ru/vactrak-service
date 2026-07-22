import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
	CreateVacancyDto,
	CreateVacancyListDto,
	CreateVacancyResponse,
	VacancySource,
	VacancyStatus,
} from './vacancy.types';
import { Vacancy } from './entities/vacancy.entity';
import { TelegramService } from '@/telegram/telegram.service';
import type { AuthUser } from '@/auth/auth.types';

@Injectable()
export class VacancyService {
	constructor(
		@InjectRepository(Vacancy)
		private readonly vacancyRepository: Repository<Vacancy>,
		private readonly telegramService: TelegramService,
	) {}

	async getById(vacancyId: number, userId: string): Promise<Vacancy> {
		const vacancy = await this.vacancyRepository.findOneBy({
			id: String(vacancyId),
			userId,
		});
		if (!vacancy) {
			throw new NotFoundException(`Vacancy ${vacancyId} not found`);
		}
		return vacancy;
	}

	/**
	 * Returns a page of vacancies for the current user only (row-level ownership).
	 */
	async getAllVacancies(
		userId: string,
		pageSize: number,
		page: number,
		source?: VacancySource,
		status?: VacancyStatus,
	): Promise<Vacancy[]> {
		const offset = (page - 1) * pageSize;
		const where: {
			userId: string;
			source?: VacancySource;
			status?: VacancyStatus;
		} = { userId };
		if (source) {
			where.source = source;
		}
		if (status) {
			where.status = status;
		}
		return this.vacancyRepository.find({
			where,
			skip: offset,
			take: pageSize,
			order: { id: 'DESC' },
		});
	}

	async updateStatus(
		vacancyId: number,
		userId: string,
		status: VacancyStatus,
	): Promise<Vacancy> {
		const vacancy = await this.getById(vacancyId, userId);
		vacancy.status = status;
		return this.vacancyRepository.save(vacancy);
	}

	/**
	 * Creates only vacancies that do not already exist for this user.
	 * Uniqueness key: (user_id, id_ext, source, title).
	 */
	async create(vacListDto: CreateVacancyListDto, user: AuthUser): Promise<CreateVacancyResponse> {
		const incoming = vacListDto.vacancyList.map((vac) => ({
			...vac,
			id_ext: String(vac.id_ext),
			date_fetched: new Date(),
			userId: user.id,
			status: 'new' as const,
		}));

		const vacancyKey = (v: {
			userId: string;
			id_ext: string;
			source: string;
			title: string;
		}) => `${v.userId}\0${v.id_ext}\0${v.source}\0${v.title}`;

		const existing = await this.vacancyRepository.find({
			where: incoming.map((v) => ({
				userId: v.userId,
				id_ext: v.id_ext,
				source: v.source,
				title: v.title,
			})),
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

		this.notifyNewVacancies(toCreate, user.telegramId);

		return {
			result: 'CREATED',
			vacancyList: saveResult.map((vac) => {
				const { id, id_ext, title, status } = vac;
				return { id, id_ext, title, status };
			}),
		};
	}

	/** Fire-and-forget Telegram notifications for newly created vacancies. */
	private notifyNewVacancies(
		vacancies: Array<CreateVacancyDto & { id_ext: string }>,
		telegramChatId: string,
	): void {
		void (async () => {
			for (const vac of vacancies) {
				try {
					await this.telegramService.sendRequestNotification(vac, telegramChatId);
					await new Promise((resolve) => setTimeout(resolve, 2000));
				} catch (err) {
					console.error('Ошибка отправки в Telegram:', err);
				}
			}
		})();
	}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
	CreateVacancyDto,
	CreateVacancyListDto,
	CreateVacancyResponse,
	VacancyItem,
} from './vac.types';
import { Vacancy } from '@hhvac/entities/vacancy.entity';

@Injectable()
export class VacService {
	constructor(
		@InjectRepository(Vacancy)
		private readonly vacancyRepository: Repository<Vacancy>,
	) {}
	getById(vacancyId: number): VacancyItem {
		return {
			id: vacancyId,
			status: 'MY_STATUS',
			date_added: '2026-07-14T22:00:48.228Z',
		};
	}
	getAll(): VacancyItem[] {
		return [
			{
				id: 666,
				status: 'MY_STATUS',
				date_added: '2026-07-14T22:00:48.228Z',
			},
			{
				id: 777,
				status: 'MY_STATUS',
				date_added: '2026-07-14T22:00:48.228Z',
			},
		];
	}

	async create(vacListDto: CreateVacancyListDto): Promise<CreateVacancyResponse> {
		const vacancies = vacListDto.vacancyList.map((vac) => {
			return {
				date_fetched: new Date(),
				...vac,
			};
		});
		const createResult = this.vacancyRepository.create(vacancies);
		const saveResult = await this.vacancyRepository.save(createResult);
		// console.log(saveResult);
		return {
			result: 'CREATED',
			vacancyList: saveResult.map((vac) => {
				const { id, id_ext, title } = vac;
				return { id, id_ext, title };
			}),
		};
	}
}

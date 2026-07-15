import { Injectable } from '@nestjs/common';
import type { CreateVacancyDto, CreateVacancyListDto, CreateVacancyResponse, VacancyItem } from './vac.types';

@Injectable()
export class VacService {
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

	async create(_dto: CreateVacancyListDto): Promise<CreateVacancyResponse> {
		return {
			result: 'CREATED',
			vacancyList: _dto.vacancyList.map(vac => ({
				internalId: Math.floor(Math.random() * 1000),
				...vac,
			})),
		};
	}
}

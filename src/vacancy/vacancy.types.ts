export type VacancyStatus = 'new' | 'archived';

export const VACANCY_STATUSES = ['new', 'archived'] as const satisfies readonly VacancyStatus[];

export type VacancySource = 'hh' | 'habr';

/** CREATE */
import type { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Vacancy } from './entities/vacancy.entity';
export type { CreateVacancyDto, CreateVacancyListDto, FilterJson } from './dto/create-vacancy.dto';

export type CreateVacancyResult = 'CREATED';

type CreateVacancyResponseListItem = Pick<Vacancy, 'id' | 'id_ext' | 'title' | 'status'>;

export interface CreateVacancyResponse {
	result: CreateVacancyResult;
	vacancyList: CreateVacancyResponseListItem[];
}

/** UPDATE */

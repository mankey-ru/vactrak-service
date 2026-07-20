export type VacancyStatus = 'MY_STATUS';

export type VacancySource = 'hh' | 'habr';

export interface VacancyItem {
	id: number;
	status: VacancyStatus;
	date_added: string;
}

/** CREATE */
import type { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Vacancy } from './entities/vacancy.entity';
export type { CreateVacancyDto, CreateVacancyListDto, FilterJson } from './dto/create-vacancy.dto';

export type CreateVacancyResult = 'CREATED';

type CreateVacancyResponseListItem = Pick<Vacancy, 'id' | 'id_ext' | 'title'>;

export interface CreateVacancyResponse {
	result: CreateVacancyResult;
	vacancyList: CreateVacancyResponseListItem[];
}

/** UPDATE */

/** DELETE */

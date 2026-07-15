export type VacancyStatus = 'MY_STATUS';

export interface VacancyItem {
	id: number;
	status: VacancyStatus;
	date_added: string;
}

/** CREATE */
import type { CreateVacancyDto } from './dto/create-vacancy.dto';
export type { CreateVacancyDto, CreateVacancyListDto } from './dto/create-vacancy.dto';

export type CreateVacancyResult = 'CREATED';

type CreateVacancyResponseListItem = CreateVacancyDto & { internalId: number };

export interface CreateVacancyResponse {
	result: CreateVacancyResult;
	vacancyList: CreateVacancyResponseListItem[];
}

/** UPDATE */

/** DELETE */

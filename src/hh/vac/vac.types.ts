export type VacancyStatus = 'MY_STATUS';

export interface VacancyItem {
	id: number;
	status: VacancyStatus;
	date_added: string;
}
/** CREATE */
export interface CreateVacancyDto {
	id: number;
	name: string;
}

export type CreateVacancyResult = 'CREATED';

export interface CreateVacancyResponse {
	result: CreateVacancyResult;
}

/** UPDATE */

/** DELETE */

export {
	VACANCY_STATUSES,
	VACANCY_SOURCES,
	type VacancyStatus,
	type VacancySource,
} from '@vactrak/shared';

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

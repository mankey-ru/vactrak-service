import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import type { VacancySource } from '../vacancy.types';

/** allowed page sizes for GET all vacancies */
export const VACANCY_PAGE_SIZES = [10, 25, 50] as const;
export type VacancyPageSize = (typeof VACANCY_PAGE_SIZES)[number];

export const VACANCY_SOURCES = ['hh', 'habr'] as const satisfies readonly VacancySource[];

export class GetAllVacanciesQueryDto {
	@Type(() => Number)
	@IsInt()
	@IsIn(VACANCY_PAGE_SIZES)
	/** page size N: 10 |25 | 50 */
	pageSize: VacancyPageSize = 10;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	/** page number M (1-based) */
	page: number = 1;

	@IsOptional()
	@IsIn(VACANCY_SOURCES)
	/** optional filter by vacancy source */
	source?: VacancySource;
}

import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { VACANCY_SOURCES, VACANCY_STATUSES } from '@vactrak/shared';
import type { VacancySource, VacancyStatus } from '@vactrak/shared';

/** allowed page sizes for GET all vacancies */
export const VACANCY_PAGE_SIZES = [10, 25, 50] as const;
export type VacancyPageSize = (typeof VACANCY_PAGE_SIZES)[number];

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

	@IsOptional()
	@IsIn(VACANCY_STATUSES)
	/** optional filter by status */
	status?: VacancyStatus;
}

import { IsIn } from 'class-validator';
import { VACANCY_STATUSES, type VacancyStatus } from '../vacancy.types';

export class UpdateVacancyStatusDto {
	@IsIn(VACANCY_STATUSES)
	status!: VacancyStatus;
}

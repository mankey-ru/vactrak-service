import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateVacancyDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	/** vacancy id */
	id: number;

	@IsString()
	@IsNotEmpty()
	/** vacancy name */
	name: string;
}

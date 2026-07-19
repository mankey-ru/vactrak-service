import { Type } from 'class-transformer';
import {
	IsInt,
	IsNotEmpty,
	IsString,
	Min,
	IsArray,
	ValidateNested,
	IsNotEmptyObject,
} from 'class-validator';
import type { VacancySource } from '../vacancy.types';

export type FilterJson = Record<string, string | string[]>;

export class CreateVacancyListDto {
	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateVacancyDto)
	/** массив вакансий */
	vacancyList!: CreateVacancyDto[];
}

export class CreateVacancyDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	/** vacancy id на источнике */
	id_ext!: string;

	@IsString()
	@IsNotEmpty()
	/** имя вакансии */
	title!: string;

	@IsString()
	@IsNotEmpty()
	/** имя компании */
	company!: string;

	@IsNotEmptyObject()
	/** фильтр вакансий */
	filter_json!: FilterJson;

	/** источник */
	@IsString()
	@IsNotEmpty()
	source!: VacancySource;

	/** ключ поискового запроса */
	@IsString()
	search_key?: string;
}

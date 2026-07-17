import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min, IsArray, ValidateNested, IsNotEmptyObject } from 'class-validator';


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
	/** vacancy id на хедхантере */
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
	source!: 'hh' | 'habr';
}

export type FilterJson = Record<string, string | string[]>;
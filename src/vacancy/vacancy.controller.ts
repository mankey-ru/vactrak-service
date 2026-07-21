import { Body, Controller, Get, Post, Param, ParseIntPipe, Query } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import type { CreateVacancyResponse } from './vacancy.types';
import { CreateVacancyListDto } from './dto/create-vacancy.dto';
import { GetAllVacanciesQueryDto } from './dto/get-all-vacancies.dto';
import { Vacancy } from './entities/vacancy.entity';

@Controller('/api/vac')
export class VacancyController {
	constructor(private readonly vacancyService: VacancyService) {}

	@Post()
	async createVacancy(@Body() body: CreateVacancyListDto): Promise<CreateVacancyResponse> {
		return this.vacancyService.create(body);
	}

	@Get()
	async getAllVacancy(@Query() query: GetAllVacanciesQueryDto): Promise<Vacancy[]> {
		return this.vacancyService.getAllVacancies(query.pageSize, query.page, query.source);
	}

	@Get(':vacancyId')
	async getVacancy(@Param('vacancyId', ParseIntPipe) vacancyId: number): Promise<Vacancy> {
		return this.vacancyService.getById(vacancyId);
	}
}

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { VacService } from './vac.service';
import type { CreateVacancyDto, CreateVacancyResponse, VacancyResponse } from './vac.types';

@Controller('api/hh/vac')
export class VacController {
	constructor(private readonly vacService: VacService) {}

	@Post()
	createVacancy(@Body() body: CreateVacancyDto): CreateVacancyResponse {
		return this.vacService.create(body);
	}

	@Get(':vacancyId')
	getVacancy(@Param('vacancyId', ParseIntPipe) vacancyId: number): VacancyResponse {
		return this.vacService.getById(vacancyId);
	}
}

import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { VacService } from './vac.service';
import type { CreateVacancyDto, CreateVacancyResponse, VacancyItem } from './vac.types';
import { TelegramNotificationInterceptor } from '../../telegram/telegram-notification.interceptor';


@Controller('api/hh/vac')
export class VacController {
	constructor(private readonly vacService: VacService) {}

	@Post()
	@UseInterceptors(TelegramNotificationInterceptor)
	async createVacancy(@Body() body: CreateVacancyDto): Promise<CreateVacancyResponse> {
		return this.vacService.create(body);
	}

	@Get(':vacancyId')
	getVacancy(@Param('vacancyId', ParseIntPipe) vacancyId: number): VacancyItem {
		return this.vacService.getById(vacancyId);
	}

	@Get()
	getAllVacancy(): VacancyItem[] {
		return this.vacService.getAll();
	}
}

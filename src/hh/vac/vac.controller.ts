import { Body, Controller, Get, Post, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { VacService } from '@hhvac/vac.service';
import type { CreateVacancyResponse, VacancyItem } from '@hhvac/vac.types';
import { CreateVacancyDto, CreateVacancyListDto } from '@hhvac/dto/create-vacancy.dto';
import { TelegramNotificationInterceptor } from '@/telegram/telegram-notification.interceptor';

@Controller('api/vac')
export class VacController {
	constructor(private readonly vacService: VacService) {}

	@Post()
	@UseInterceptors(TelegramNotificationInterceptor)
	async createVacancy(@Body() body: CreateVacancyListDto): Promise<CreateVacancyResponse> {
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

import {
	Body,
	Controller,
	Get,
	Post,
	Param,
	ParseIntPipe,
	UseInterceptors,
} from '@nestjs/common';
import { VacancyService } from '@/vacancy/vacancy.service';
import type {
	CreateVacancyResponse,
	VacancyItem,
} from '@/vacancy/vacancy.types';
import { CreateVacancyListDto } from '@/vacancy/dto/create-vacancy.dto';
import { TelegramNotificationInterceptor } from '@/telegram/telegram-notification.interceptor';
import { mapCreateListToHh } from './hh-vacancy.mapper';

@Controller('api/vac')
export class HhController {
	constructor(private readonly vacancyService: VacancyService) {}

	@Post()
	@UseInterceptors(TelegramNotificationInterceptor)
	async createVacancy(
		@Body() body: CreateVacancyListDto,
	): Promise<CreateVacancyResponse> {
		return this.vacancyService.create(mapCreateListToHh(body));
	}

	@Get(':vacancyId')
	getVacancy(
		@Param('vacancyId', ParseIntPipe) vacancyId: number,
	): VacancyItem {
		return this.vacancyService.getById(vacancyId);
	}

	@Get()
	getAllVacancy(): VacancyItem[] {
		return this.vacancyService.getAll();
	}
}

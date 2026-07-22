import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import type { CreateVacancyResponse } from './vacancy.types';
import { CreateVacancyListDto } from './dto/create-vacancy.dto';
import { GetAllVacanciesQueryDto } from './dto/get-all-vacancies.dto';
import { UpdateVacancyStatusDto } from './dto/update-vacancy-status.dto';
import { Vacancy } from './entities/vacancy.entity';
import { CombinedAuthGuard } from '@/auth/guards/combined-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/auth.types';

@Controller('/api/vac')
@UseGuards(CombinedAuthGuard)
export class VacancyController {
	constructor(private readonly vacancyService: VacancyService) {}

	@Post()
	async createVacancy(
		@Body() body: CreateVacancyListDto,
		@CurrentUser() user: AuthUser,
	): Promise<CreateVacancyResponse> {
		return this.vacancyService.create(body, user);
	}

	@Get()
	async getAllVacancy(
		@Query() query: GetAllVacanciesQueryDto,
		@CurrentUser() user: AuthUser,
	): Promise<Vacancy[]> {
		return this.vacancyService.getAllVacancies(
			user.id,
			query.pageSize,
			query.page,
			query.source,
			query.status,
		);
	}

	@Get(':vacancyId')
	async getVacancy(
		@Param('vacancyId', ParseIntPipe) vacancyId: number,
		@CurrentUser() user: AuthUser,
	): Promise<Vacancy> {
		return this.vacancyService.getById(vacancyId, user.id);
	}

	@Patch(':vacancyId/status')
	async updateStatus(
		@Param('vacancyId', ParseIntPipe) vacancyId: number,
		@Body() body: UpdateVacancyStatusDto,
		@CurrentUser() user: AuthUser,
	): Promise<Vacancy> {
		return this.vacancyService.updateStatus(vacancyId, user.id, body.status);
	}
}

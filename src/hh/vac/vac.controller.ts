import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VacService } from './vac.service';
import type { VacancyResponse } from './vac.types';

@Controller('api/hh/vac')
export class VacController {
  constructor(private readonly vacService: VacService) {}

  @Get(':vacancyId')
  getVacancy(
    @Param('vacancyId', ParseIntPipe) vacancyId: number,
  ): VacancyResponse {
    return this.vacService.getById(vacancyId);
  }
}

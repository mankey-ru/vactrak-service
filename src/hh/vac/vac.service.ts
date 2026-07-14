import { Injectable } from '@nestjs/common';
import type { VacancyResponse } from './vac.types';

@Injectable()
export class VacService {
  getById(vacancyId: number): VacancyResponse {
    return {
      id: vacancyId,
      status: 'MY_STATUS',
      date_added: '2026-07-14T22:00:48.228Z',
    };
  }
}

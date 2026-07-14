export type VacancyStatus = 'MY_STATUS';

export interface VacancyResponse {
  id: number;
  status: VacancyStatus;
  date_added: string;
}

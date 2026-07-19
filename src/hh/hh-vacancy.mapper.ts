import type { CreateVacancyListDto } from '@/vacancy/vacancy.types';

/**
 * Force HH ingest source on every item (overwrite non-hh if present).
 * Mutates the list in place so interceptors reading req.body see the same source.
 */
export function mapCreateListToHh(
	body: CreateVacancyListDto,
): CreateVacancyListDto {
	for (const vac of body.vacancyList) {
		vac.source = 'hh';
	}
	return body;
}

export function buildHhVacancyUrl(id_ext: string): string {
	return `https://hh.ru/vacancy/${id_ext}`;
}

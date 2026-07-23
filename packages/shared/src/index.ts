/** Shared vacancy pipeline statuses (API + Nuxt). */
export const VACANCY_STATUSES = ['new', 'archived'] as const;
export type VacancyStatus = (typeof VACANCY_STATUSES)[number];

/** Job board sources supported by the userscript / API. */
export const VACANCY_SOURCES = ['hh', 'habr'] as const;
export type VacancySource = (typeof VACANCY_SOURCES)[number];

/** API path prefixes (Nuxt and docs). */
export const API_PATHS = {
	authTelegram: '/api/auth/telegram',
	authMe: '/api/auth/me',
	authTokens: '/api/auth/tokens',
	vacancies: '/api/vac',
} as const;

export interface AuthUserDto {
	id: string;
	telegramId: string;
	username?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	photoUrl?: string | null;
}

export interface AuthLoginResponseDto {
	accessToken: string;
	tokenType: 'Bearer';
	expiresIn: string;
	user: AuthUserDto;
}

export interface VacancyDto {
	id: string;
	userId: string;
	id_ext: string;
	title: string;
	company: string;
	source: VacancySource;
	status: VacancyStatus;
	search_key?: string | null;
	date_fetched: string;
	filter_json?: Record<string, string | string[]>;
}

export interface UpdateVacancyStatusBody {
	status: VacancyStatus;
}

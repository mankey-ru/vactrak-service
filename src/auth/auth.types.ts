export interface JwtPayload {
	/** user id (string bigint) */
	sub: string;
	telegramId: string;
}

export interface AuthUser {
	id: string;
	telegramId: string;
	username?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	photoUrl?: string | null;
}

export interface TelegramLoginData {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}

import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** Payload from Telegram Login Widget (server-side verification). */
export class TelegramLoginDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	id!: number;

	@IsString()
	@IsNotEmpty()
	first_name!: string;

	@IsOptional()
	@IsString()
	last_name?: string;

	@IsOptional()
	@IsString()
	username?: string;

	@IsOptional()
	@IsString()
	photo_url?: string;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	auth_date!: number;

	@IsString()
	@IsNotEmpty()
	hash!: string;
}

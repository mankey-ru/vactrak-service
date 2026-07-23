import {
	Injectable,
	UnauthorizedException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { IsNull, Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { ApiToken } from '@/user/entities/api-token.entity';
import { verifyTelegramLogin } from './telegram-login.verify';
import type { AuthUser, JwtPayload, TelegramLoginData } from './auth.types';
import { toAuthUser } from './jwt.strategy';

export interface AuthLoginResponse {
	accessToken: string;
	tokenType: 'Bearer';
	expiresIn: string;
	user: AuthUser;
}

export interface CreateApiTokenResponse {
	id: string;
	token: string;
	tokenPrefix: string;
	label?: string | null;
	createdAt: Date;
}

export interface ApiTokenListItem {
	id: string;
	tokenPrefix: string;
	label?: string | null;
	createdAt: Date;
	revokedAt?: Date | null;
}

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(ApiToken)
		private readonly apiTokenRepository: Repository<ApiToken>,
	) {}

	async loginWithTelegram(data: TelegramLoginData): Promise<AuthLoginResponse> {
		const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
		if (!verifyTelegramLogin(data, botToken)) {
			throw new UnauthorizedException('Invalid Telegram login data');
		}

		const telegramId = String(data.id);
		let user = await this.userRepository.findOneBy({ telegramId });
		if (!user) {
			user = this.userRepository.create({
				telegramId,
				username: data.username ?? null,
				firstName: data.first_name ?? null,
				lastName: data.last_name ?? null,
				photoUrl: data.photo_url ?? null,
			});
		} else {
			user.username = data.username ?? user.username;
			user.firstName = data.first_name ?? user.firstName;
			user.lastName = data.last_name ?? user.lastName;
			user.photoUrl = data.photo_url ?? user.photoUrl;
		}
		user = await this.userRepository.save(user);

		const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d');
		const payload: JwtPayload = {
			sub: user.id,
			telegramId: String(user.telegramId),
		};
		const accessToken = await this.jwtService.signAsync(payload);

		return {
			accessToken,
			tokenType: 'Bearer',
			expiresIn,
			user: toAuthUser(user),
		};
	}

	async getMe(userId: string): Promise<AuthUser> {
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return toAuthUser(user);
	}

	async createApiToken(userId: string, label?: string): Promise<CreateApiTokenResponse> {
		const raw = `vt_${randomBytes(32).toString('base64url')}`;
		const tokenHash = createHash('sha256').update(raw).digest('hex');
		const tokenPrefix = raw.slice(0, 11); // "vt_" + 8

		const entity = this.apiTokenRepository.create({
			userId,
			tokenHash,
			tokenPrefix,
			label: label ?? null,
		});
		const saved = await this.apiTokenRepository.save(entity);

		return {
			id: saved.id,
			token: raw,
			tokenPrefix: saved.tokenPrefix,
			label: saved.label,
			createdAt: saved.createdAt,
		};
	}

	async listApiTokens(userId: string): Promise<ApiTokenListItem[]> {
		const rows = await this.apiTokenRepository.find({
			where: { userId },
			order: { id: 'DESC' },
		});
		return rows.map((r) => ({
			id: r.id,
			tokenPrefix: r.tokenPrefix,
			label: r.label,
			createdAt: r.createdAt,
			revokedAt: r.revokedAt,
		}));
	}

	async revokeApiToken(userId: string, tokenId: string): Promise<{ revoked: true }> {
		const row = await this.apiTokenRepository.findOneBy({
			id: tokenId,
			userId,
		});
		if (!row) {
			throw new NotFoundException('Token not found');
		}
		if (row.revokedAt) {
			throw new BadRequestException('Token already revoked');
		}
		row.revokedAt = new Date();
		await this.apiTokenRepository.save(row);
		return { revoked: true };
	}

	/** Test helper / seed: ensure a user exists by telegram id (no widget verify). */
	async upsertUserByTelegramId(
		telegramId: string,
		profile?: Partial<Pick<User, 'username' | 'firstName'>>,
	): Promise<User> {
		let user = await this.userRepository.findOneBy({ telegramId });
		if (!user) {
			user = this.userRepository.create({
				telegramId,
				username: profile?.username ?? null,
				firstName: profile?.firstName ?? 'User',
			});
			user = await this.userRepository.save(user);
		}
		return user;
	}
}

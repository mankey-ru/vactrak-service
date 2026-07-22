import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { IsNull, Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { ApiToken } from '@/user/entities/api-token.entity';
import type { AuthUser, JwtPayload } from '../auth.types';
import { toAuthUser } from '../jwt.strategy';

/**
 * Accepts either:
 * - Authorization: Bearer <JWT> (Nuxt / browser session)
 * - Authorization: Bearer <api token> (userscript / machine)
 */
@Injectable()
export class CombinedAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(ApiToken)
		private readonly apiTokenRepository: Repository<ApiToken>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<{
			headers: { authorization?: string };
			user?: AuthUser;
		}>();
		const header = request.headers.authorization;
		if (!header?.startsWith('Bearer ')) {
			throw new UnauthorizedException('Missing Bearer token');
		}
		const token = header.slice('Bearer '.length).trim();
		if (!token) {
			throw new UnauthorizedException('Missing Bearer token');
		}

		// Prefer JWT when it verifies; otherwise treat as opaque API token.
		const userFromJwt = await this.tryJwt(token);
		if (userFromJwt) {
			request.user = userFromJwt;
			return true;
		}

		const userFromApi = await this.tryApiToken(token);
		if (userFromApi) {
			request.user = userFromApi;
			return true;
		}

		throw new UnauthorizedException('Invalid token');
	}

	private async tryJwt(token: string): Promise<AuthUser | null> {
		try {
			const secret = this.configService.get<string>('JWT_SECRET');
			if (!secret) {
				return null;
			}
			const payload = this.jwtService.verify<JwtPayload>(token, { secret });
			const user = await this.userRepository.findOneBy({ id: String(payload.sub) });
			return user ? toAuthUser(user) : null;
		} catch {
			return null;
		}
	}

	private async tryApiToken(rawToken: string): Promise<AuthUser | null> {
		const tokenHash = createHash('sha256').update(rawToken).digest('hex');
		const row = await this.apiTokenRepository.findOne({
			where: { tokenHash, revokedAt: IsNull() },
			relations: { user: true },
		});
		if (!row?.user) {
			return null;
		}
		return toAuthUser(row.user);
	}
}

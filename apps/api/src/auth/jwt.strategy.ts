import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import type { AuthUser, JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		configService: ConfigService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		const secret = configService.get<string>('JWT_SECRET');
		if (!secret) {
			throw new Error('JWT_SECRET is required');
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}

	async validate(payload: JwtPayload): Promise<AuthUser> {
		const user = await this.userRepository.findOneBy({ id: String(payload.sub) });
		if (!user) {
			throw new UnauthorizedException('User not found');
		}
		return toAuthUser(user);
	}
}

export function toAuthUser(user: User): AuthUser {
	return {
		id: user.id,
		telegramId: String(user.telegramId),
		username: user.username,
		firstName: user.firstName,
		lastName: user.lastName,
		photoUrl: user.photoUrl,
	};
}

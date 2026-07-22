import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { CombinedAuthGuard } from './guards/combined-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
	imports: [
		UserModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: config.get('JWT_EXPIRES_IN', '7d') as `${number}d`,
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, CombinedAuthGuard, JwtAuthGuard],
	exports: [AuthService, JwtModule, CombinedAuthGuard, JwtAuthGuard, UserModule],
})
export class AuthModule {}

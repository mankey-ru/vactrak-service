import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { VacancyModule } from '@/vacancy/vacancy.module';
import { TelegramModule } from '@/telegram/telegram.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const host = configService.get<string>('POSTGRES_HOST') ?? '';
				// Render (and most managed PG) require TLS. Without ssl, Nest hangs before listen().
				const sslFlag = (configService.get<string>('POSTGRES_SSL') ?? '').toLowerCase();
				const useSsl =
					sslFlag === 'true' ||
					sslFlag === '1' ||
					(sslFlag !== 'false' &&
						(host.includes('render.com') || host.includes('amazonaws.com')));

				const syncRaw = String(configService.get('DB_SYNCHRONIZE') ?? 'false');
				const logRaw = String(configService.get('DB_LOGGING') ?? 'true');

				return {
					// TODO! добавить manualInitialization чтобы сервис не падал при отсутствии БД
					type: 'postgres' as const,
					host,
					port: Number(configService.get('POSTGRES_PORT') ?? 5432),
					username: configService.get<string>('POSTGRES_USER'),
					password: configService.get<string>('POSTGRES_PASSWORD'),
					database: configService.get<string>('POSTGRES_DB'),
					entities: [__dirname + '/**/*.entity{.ts,.js}'],
					synchronize: syncRaw === 'true' || syncRaw === '1',
					logging: logRaw === 'true' || logRaw === '1',
					autoLoadEntities: true,
					ssl: useSsl ? { rejectUnauthorized: false } : false,
					// Fail fast instead of hanging health checks forever
					retryAttempts: 5,
					retryDelay: 3000,
				};
			},
		}),
		UserModule,
		AuthModule,
		TelegramModule,
		VacancyModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

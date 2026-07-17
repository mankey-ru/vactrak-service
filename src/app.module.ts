import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { HhModule } from '@/hh/hh.module';
import { TelegramModule } from '@/telegram/telegram.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({				
				// TODO! добавить manualInitialization чтобы сервис не падал при отсутствии БД
				type: 'postgres' as const,
				host: configService.get<string>('POSTGRES_HOST'),
				port: configService.get<number>('POSTGRES_PORT'),
				username: configService.get<string>('POSTGRES_USER'),
				password: configService.get<string>('POSTGRES_PASSWORD'),
				database: configService.get<string>('POSTGRES_DB'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'], // или путь к entities
				synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
				logging: configService.get<boolean>('DB_LOGGING', true),
				autoLoadEntities: true, // удобно
			}),
		}),
		TelegramModule,
		HhModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

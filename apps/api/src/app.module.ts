import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { VacancyModule } from '@/vacancy/vacancy.module';
import { TelegramModule } from '@/telegram/telegram.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { buildTypeOrmOptions, nestTypeOrmExtra } from '@/database/typeorm.config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: () => ({
				// process.env already loaded by ConfigModule.forRoot (global).
				...buildTypeOrmOptions(),
				...nestTypeOrmExtra(),
			}),
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

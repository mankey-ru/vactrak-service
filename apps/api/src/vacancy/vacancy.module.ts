import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { TelegramModule } from '@/telegram/telegram.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([Vacancy]), TelegramModule, AuthModule],
	controllers: [VacancyController],
	providers: [VacancyService],
	exports: [VacancyService, TypeOrmModule],
})
export class VacancyModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { VacancyService } from './vacancy.service';

@Module({
	imports: [TypeOrmModule.forFeature([Vacancy])],
	providers: [VacancyService],
	exports: [VacancyService, TypeOrmModule],
})
export class VacancyModule {}

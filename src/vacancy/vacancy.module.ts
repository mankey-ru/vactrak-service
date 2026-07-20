import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { VacancyMiddleware } from './vacancy.middleware';
import { TelegramModule } from '@/telegram/telegram.module';

@Module({
	imports: [TypeOrmModule.forFeature([Vacancy]), TelegramModule],
	controllers: [VacancyController],
	providers: [VacancyService],
	exports: [VacancyService, TypeOrmModule],
})
export class VacancyModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// Must use RequestMethod.ALL + explicit paths so OPTIONS preflight
		// is covered. forRoutes(VacancyController) only matches registered
		// GET/POST handlers, so browsers never see CORS headers.
		consumer
			.apply(VacancyMiddleware)
			.forRoutes(
				{ path: 'api/vac', method: RequestMethod.ALL },
				{ path: 'api/vac/*path', method: RequestMethod.ALL },
			);
	}
}

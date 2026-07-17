import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { VacController } from '@hhvac/vac.controller';
import { VacService } from '@hhvac/vac.service';
import { TelegramModule } from '@/telegram/telegram.module';
import { HhCorsMiddleware } from '@/hh/hh-cors.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from '@hhvac/entities/vacancy.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Vacancy]), TelegramModule],
	controllers: [VacController],
	providers: [VacService],
	exports: [VacService],
})
export class HhModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// Must use RequestMethod.ALL + explicit paths so OPTIONS preflight
		// is covered. forRoutes(VacController) only matches registered
		// GET/POST handlers, so browsers never see CORS headers.
		consumer
			.apply(HhCorsMiddleware)
			.forRoutes(
				{ path: 'api/vac', method: RequestMethod.ALL },
				{ path: 'api/vac/*path', method: RequestMethod.ALL },
			);
	}
}

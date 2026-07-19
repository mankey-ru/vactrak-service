import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HhController } from './hh.controller';
import { VacancyModule } from '@/vacancy/vacancy.module';
import { TelegramModule } from '@/telegram/telegram.module';
import { HhCorsMiddleware } from '@/hh/hh-cors.middleware';

@Module({
	imports: [VacancyModule, TelegramModule],
	controllers: [HhController],
})
export class HhModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// Must use RequestMethod.ALL + explicit paths so OPTIONS preflight
		// is covered. forRoutes(HhController) only matches registered
		// GET/POST handlers, so browsers never see CORS headers.
		consumer
			.apply(HhCorsMiddleware)
			.forRoutes(
				{ path: 'api/vac', method: RequestMethod.ALL },
				{ path: 'api/vac/*path', method: RequestMethod.ALL },
			);
	}
}

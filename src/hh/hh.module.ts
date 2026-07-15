import {
	Module,
	NestModule,
	MiddlewareConsumer,
	RequestMethod,
} from '@nestjs/common';
import { VacController } from './vac/vac.controller';
import { VacService } from './vac/vac.service';
import { TelegramModule } from '../telegram/telegram.module';
import { HhCorsMiddleware } from './hh-cors.middleware';

@Module({
	imports: [TelegramModule],
	controllers: [VacController],
	providers: [VacService],
})
export class HhModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// Must use RequestMethod.ALL + explicit paths so OPTIONS preflight
		// is covered. forRoutes(VacController) only matches registered
		// GET/POST handlers, so browsers never see CORS headers.
		consumer.apply(HhCorsMiddleware).forRoutes(
			{ path: 'api/hh/vac', method: RequestMethod.ALL },
			{ path: 'api/hh/vac/*path', method: RequestMethod.ALL },
		);
	}
}

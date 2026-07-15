import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HhModule } from './hh/hh.module';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram/telegram.service';
import { TelegramNotificationMiddleware } from './telegram/telegram-notification.middleware';

@Module({
	imports: [HhModule, ConfigModule.forRoot({ isGlobal: true })],
	controllers: [AppController],
	providers: [AppService, TelegramService, TelegramNotificationMiddleware],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(TelegramNotificationMiddleware)
			.exclude(
				// пути, которые не нужно логировать
				// { path: 'health', method: RequestMethod.GET },
			)
			.forRoutes(
				{ path: 'api/hh/vac', method: RequestMethod.POST },
				{ path: 'api/hh/vac/:vacancyId', method: RequestMethod.GET },
			);
	}
}

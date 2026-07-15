import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramNotificationInterceptor } from './telegram-notification.interceptor';

@Module({
	providers: [TelegramService, TelegramNotificationInterceptor],
	exports: [TelegramService, TelegramNotificationInterceptor],
})
export class TelegramModule {}

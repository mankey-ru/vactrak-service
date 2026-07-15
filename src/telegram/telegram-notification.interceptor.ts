import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramNotificationInterceptor implements NestInterceptor {
	constructor(private readonly telegramService: TelegramService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const { method, originalUrl, ip, body } = req;

		// Отправляем уведомление ТОЛЬКО если обработчик успешно завершился
		return next.handle().pipe(
			tap(() => {
				this.telegramService
					.sendRequestNotification(body)
					.catch((err) => console.error('Ошибка отправки в Telegram:', err));
			}),
		);
	}
}

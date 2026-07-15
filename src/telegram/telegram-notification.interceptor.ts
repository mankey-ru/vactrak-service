import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TelegramService } from './telegram.service';
import { CreateVacancyListDto } from '../hh/vac/vac.types';

@Injectable()
export class TelegramNotificationInterceptor implements NestInterceptor {
	constructor(private readonly telegramService: TelegramService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const vacListBody: CreateVacancyListDto = req.body;
		return next.handle().pipe(
			tap(() => {
				vacListBody.vacancyList.forEach(async (vac) => {
					await new Promise((res) => setTimeout(res, 2000));
					this.telegramService
						.sendRequestNotification(vac)
						.catch((err) => console.error('Ошибка отправки в Telegram:', err));
				});
			}),
		);
	}
}

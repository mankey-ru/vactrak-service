import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramNotificationMiddleware implements NestMiddleware {
	constructor(private readonly telegramService: TelegramService) {}

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, originalUrl, ip } = req;

		// Пример фильтрации
		// if (originalUrl.startsWith('/health') || originalUrl.startsWith('/metrics')) {
		// 	return next();
		// }

		// Отправляем в фоне, не блокируем запрос
		this.telegramService
			.sendRequestNotification(method, originalUrl, ip || 'unknown')
			.catch((err) => console.error('Ошибка в Telegram middleware:', err));

		next();
	}
}

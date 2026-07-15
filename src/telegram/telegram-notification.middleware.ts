import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegramService } from './telegram.service';
import { CreateVacancyDto } from '../hh/vac/vac.types';

@Injectable()
export class TelegramNotificationMiddleware implements NestMiddleware {
	constructor(private readonly telegramService: TelegramService) {}

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, originalUrl, ip, body } = req;

		// Пример фильтрации
		// if (originalUrl.startsWith('/health') || originalUrl.startsWith('/metrics')) {
		// 	return next();
		// }

		// Отправляем в фоне, не блокируем запрос
		this.telegramService
			.sendRequestNotification(body)
			.catch((err) => console.error('Ошибка в Telegram middleware:', err));

		next();
	}
}

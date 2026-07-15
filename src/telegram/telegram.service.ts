import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
	private readonly botToken: string;
	private readonly chatId: string;

	constructor(private readonly configService: ConfigService) {
		this.botToken =
			this.configService.get<string>('TELEGRAM_BOT_TOKEN') || process.env.TELEGRAM_BOT_TOKEN || '';
		this.chatId =
			this.configService.get<string>('TELEGRAM_CHAT_ID') || process.env.TELEGRAM_CHAT_ID || '';
	}

	async sendRequestNotification(method: string, url: string, ip: string): Promise<void> {
		if (!this.botToken || !this.chatId) {
			console.warn('Telegram не настроен: отсутствуют TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
			return;
		}

		const text = `🔔 
		Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Bangkok' })} БКК
`;

		const urlApi = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

		try {
			const response = await fetch(urlApi, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: this.chatId,
					text,
				}),
			});

			if (!response.ok) {
				console.error('Ошибка Telegram API:', response.status, await response.text());
			}
		} catch (error) {
			console.error('Не удалось отправить сообщение в Telegram:', error);
			// Не пробрасываем ошибку, чтобы не ломать основной запрос
		}
	}
}

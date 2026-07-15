import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CreateVacancyResponse, VacancyItem, CreateVacancyDto } from './../hh/vac/vac.types';

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

	async sendRequestNotification(body: CreateVacancyDto): Promise<void> {
		if (!this.botToken || !this.chatId) {
			console.warn('Telegram не настроен: отсутствуют TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
			return;
		}
		const date = `${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Bangkok' })} БКК`;
		const message = `
		🚀 [${body.id}] <a href="https://hh.ru/vacancy/${body.id}">${body.name}</a>
		`;

		const urlApi = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

		try {
			const response = await fetch(urlApi, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: this.chatId,
					text: message.trim(),
					parse_mode: 'HTML',
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

	private escapeHtml(text: string): string {
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
}


/*
 * === HTML-форматирование сообщений Telegram ===
 * parse_mode: 'HTML'
 *
 * Жирный текст:
 *   <b>текст</b>          или  <strong>текст</strong>
 * Курсив:
 *   <i>текст</i>          или  <em>текст</em> *
 * Подчёркнутый:
 *   <u>текст</u>          или  <ins>текст</ins> *
 * Зачёркнутый:
 *   <s>текст</s>          или  <del>текст</del>  или  <strike>текст</strike> *
 * Спойлер (скрытый текст):
 *   <tg-spoiler>текст</tg-spoiler> *
 * Встроенный код:
 *   <code>текст</code> *
 * Блок кода (pre):
 *   <pre>текст</pre> *
 * Блок кода с подсветкой языка:
 *   <pre><code class="language-js">const x = 1;</code></pre> *
 * Ссылка (named link):
 *   <a href="https://example.com">Название ссылки</a> *
 * Упоминание пользователя:
 *   <a href="tg://user?id=123456789">Имя пользователя</a> *
 * Цитата:
 *   <blockquote>текст цитаты</blockquote> *
 * Разворачиваемая цитата:
 *   <blockquote expandable>длинный текст</blockquote> *
 * Кастомный эмодзи (только Premium):
 *   <tg-emoji emoji-id="5368324170671202286">😀</tg-emoji>
 */
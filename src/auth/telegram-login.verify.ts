import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { TelegramLoginData } from './auth.types';

const DEFAULT_MAX_AGE_SEC = 86400; // 24h

/**
 * Verifies Telegram Login Widget data.
 * @see https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramLogin(
	data: TelegramLoginData,
	botToken: string,
	maxAgeSec: number = DEFAULT_MAX_AGE_SEC,
): boolean {
	if (!botToken) {
		return false;
	}

	const now = Math.floor(Date.now() / 1000);
	if (!data.auth_date || now - data.auth_date > maxAgeSec) {
		return false;
	}

	const { hash, ...fields } = data;
	if (!hash || typeof hash !== 'string') {
		return false;
	}

	const checkString = Object.keys(fields)
		.filter((key) => {
			const value = fields[key as keyof typeof fields];
			return value !== undefined && value !== null && value !== '';
		})
		.sort()
		.map((key) => `${key}=${fields[key as keyof typeof fields]}`)
		.join('\n');

	const secretKey = createHash('sha256').update(botToken).digest();
	const computed = createHmac('sha256', secretKey).update(checkString).digest('hex');

	try {
		const a = Buffer.from(computed, 'hex');
		const b = Buffer.from(hash, 'hex');
		if (a.length !== b.length) {
			return false;
		}
		return timingSafeEqual(a, b);
	} catch {
		return false;
	}
}

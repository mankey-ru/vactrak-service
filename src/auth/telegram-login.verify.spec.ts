import { createHash, createHmac } from 'crypto';
import { verifyTelegramLogin } from './telegram-login.verify';

function sign(fields: Record<string, string | number>, botToken: string): string {
	const checkString = Object.keys(fields)
		.sort()
		.map((k) => `${k}=${fields[k]}`)
		.join('\n');
	const secretKey = createHash('sha256').update(botToken).digest();
	return createHmac('sha256', secretKey).update(checkString).digest('hex');
}

describe('verifyTelegramLogin', () => {
	const botToken = '123456:ABC-DEF';

	it('accepts a valid signature within max age', () => {
		const auth_date = Math.floor(Date.now() / 1000);
		const fields = {
			id: 42,
			first_name: 'Ada',
			username: 'ada',
			auth_date,
		};
		const hash = sign(fields, botToken);
		expect(verifyTelegramLogin({ ...fields, hash }, botToken)).toBe(true);
	});

	it('rejects wrong hash', () => {
		const auth_date = Math.floor(Date.now() / 1000);
		expect(
			verifyTelegramLogin(
				{
					id: 1,
					first_name: 'X',
					auth_date,
					hash: '0'.repeat(64),
				},
				botToken,
			),
		).toBe(false);
	});

	it('rejects expired auth_date', () => {
		const auth_date = Math.floor(Date.now() / 1000) - 100_000;
		const fields = { id: 1, first_name: 'X', auth_date };
		const hash = sign(fields, botToken);
		expect(verifyTelegramLogin({ ...fields, hash }, botToken, 86400)).toBe(false);
	});
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-01-01',
	devtools: { enabled: true },
	ssr: true,
	build: {
		transpile: ['@vactrak/shared'],
	},
	runtimeConfig: {
		/** server-only override if needed */
		apiBase: process.env.NUXT_API_BASE || process.env.API_BASE || 'http://localhost:3000',
		public: {
			/** Browser + SSR public API origin (no trailing slash) */
			apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
			/** Bot username without @ for Telegram Login Widget */
			telegramBotUsername: process.env.NUXT_PUBLIC_TELEGRAM_BOT_USERNAME || '',
		},
	},
	app: {
		head: {
			title: 'VacTrak',
			meta: [{ name: 'description', content: 'Track vacancies — my list' }],
		},
	},
});

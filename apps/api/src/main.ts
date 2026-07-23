import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

// Job boards that post vacancies via userscript / browser from their origin.
const JOB_SITE_ORIGINS = ['https://hh.ru', 'https://hh.uz', 'https://rabota.by', 'https://career.habr.com'];

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// e.g. https://vactrak-web.onrender.com — comma-separated for multiple web apps
	const webOrigins = (process.env.WEB_ORIGIN ?? '')
		.split(',')
		.map((o) => o.trim())
		.filter(Boolean);
	const allowedOrigins = new Set([...webOrigins, ...JOB_SITE_ORIGINS]);

	app.enableCors({
		// Reflect allowed origins so credentials work. No Origin (curl) is always fine.
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.has(origin) || webOrigins.length === 0) {
				// webOrigins empty → dev: reflect any origin (same as previous `true`)
				callback(null, true);
				return;
			}
			callback(null, false);
		},
		credentials: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			disableErrorMessages: false,
		}),
	);

	// Render injects PORT (e.g. 10000). Bind 0.0.0.0 so the platform health check can reach us.
	const port = Number(process.env.PORT) || 3000;
	await app.listen(port, '0.0.0.0');
	console.log(`VacTrak API listening on http://0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
	console.error('Failed to start Nest application:', err);
	process.exit(1);
});

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const webOrigin = process.env.WEB_ORIGIN; // e.g. https://vactrak-web.onrender.com
	app.enableCors({
		origin: webOrigin
			? webOrigin.split(',').map((o) => o.trim())
			: true, // reflect request origin in dev
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

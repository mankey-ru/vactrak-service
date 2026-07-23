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
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

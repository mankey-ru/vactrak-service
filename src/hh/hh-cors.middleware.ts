import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HhCorsMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const origin = req.headers.origin as string;

		const allowedOrigins = ['https://hh.ru', 'https://hh.uz', 'https://rabota.by'];

		if (allowedOrigins.includes(origin)) {
			res.header('Access-Control-Allow-Origin', origin);
			res.header('Access-Control-Allow-Credentials', 'true');
		}

		if (req.method === 'OPTIONS') {
			return res.status(204).end();
		}

		next();
	}
}

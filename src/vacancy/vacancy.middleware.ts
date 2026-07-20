import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const ALLOWED_ORIGINS = ['https://hh.ru', 'https://hh.uz', 'https://rabota.by'];

@Injectable()
export class VacancyMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const origin = req.headers.origin;
		const allowAll = true;

		if (allowAll) {
			// Reflect request origin when present so credentials stay valid.
			// Browsers reject Access-Control-Allow-Origin: * with credentials.
			if (origin) {
				res.header('Access-Control-Allow-Origin', origin);
				res.header('Access-Control-Allow-Credentials', 'true');
				res.header('Vary', 'Origin');
			} else {
				res.header('Access-Control-Allow-Origin', '*');
			}
		} else if (origin && ALLOWED_ORIGINS.includes(origin)) {
			res.header('Access-Control-Allow-Origin', origin);
			res.header('Access-Control-Allow-Credentials', 'true');
			res.header('Vary', 'Origin');
		}

		res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
		res.header(
			'Access-Control-Allow-Headers',
			req.headers['access-control-request-headers'] || 'Content-Type, Authorization',
		);

		if (req.method === 'OPTIONS') {
			return res.status(204).end();
		}

		next();
	}
}

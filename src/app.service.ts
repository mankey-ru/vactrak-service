import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getInfo(): unknown {
		return {
			status: 'ok',
			version: process.env.npm_package_version,
			env: process.env.NODE_ENV,
			uptime: `${Math.round(process.uptime())} sec.`,
		};
	}
}

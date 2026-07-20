import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getInfo(): Record<string, any> {
		return {
			status: 'ok',
			version: process.env.npm_package_version,
			env: process.env.NODE_ENV,
			uptime: formatSeconds(process.uptime()),
		};
	}
}

function formatSeconds(totalSeconds) {
	// Ensure we deal with a positive integer
	const secs = Math.abs(Math.floor(totalSeconds));

	const days = Math.floor(secs / 86400);
	const hours = Math.floor((secs % 86400) / 3600);
	const minutes = Math.floor((secs % 3600) / 60);
	const seconds = secs % 60;

	// Format to 2 digits with leading zeros
	const dd = days ? String(days).padStart(2, '0') + 'd ' : '';
	const hh = hours ? String(hours).padStart(2, '0') + 'h ' : '';
	const mm = minutes ? String(minutes).padStart(2, '0') + 'm ' : '';
	const ss = seconds ? String(seconds).padStart(2, '0') + 's ' : '';

	return `${dd}${hh}${mm}${ss}`.trim();
}

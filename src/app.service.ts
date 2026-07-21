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

	getStartPageContent(): string {
		return `
<!DOCTYPE html>
<html>
<head>
	<title>Start page</title>
	<style>
		body {
			font-family: sans-serif;
			max-width: 900px;
			margin: 0 auto;
			padding: 20px;
			background-color: darkgray;
		}
	</style>
</head>
<body>
	<h1>vactrak FTW!</h1>
</body>
</html>
		`.trim();
	}
}

function formatSeconds(totalSeconds: number): string {
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

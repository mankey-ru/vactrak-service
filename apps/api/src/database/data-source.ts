import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm.config';

/**
 * TypeORM CLI entry (generate / run / revert).
 * Loads apps/api/.env when present (cwd may be monorepo root or apps/api).
 */
function loadApiEnv(): void {
	const candidates = [
		join(process.cwd(), '.env'),
		join(process.cwd(), 'apps/api/.env'),
		join(__dirname, '../../.env'),
	];
	for (const p of candidates) {
		if (existsSync(p)) {
			loadEnv({ path: p });
			return;
		}
	}
	loadEnv();
}

loadApiEnv();

export default new DataSource(
	buildTypeOrmOptions({
		// CLI never auto-syncs
		synchronize: false,
		migrationsRun: false,
	}),
);

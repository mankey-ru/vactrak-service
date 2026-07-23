import { join } from 'path';
import type { DataSourceOptions } from 'typeorm';

function env(key: string, fallback = ''): string {
	return process.env[key] ?? fallback;
}

function envBool(key: string, defaultValue: boolean): boolean {
	const raw = process.env[key];
	if (raw === undefined || raw === '') {
		return defaultValue;
	}
	const v = String(raw).toLowerCase();
	return v === 'true' || v === '1';
}

/** Shared Postgres options for Nest and TypeORM CLI. */
export function buildTypeOrmOptions(
	overrides: Partial<DataSourceOptions> = {},
): DataSourceOptions {
	const host = env('POSTGRES_HOST', 'localhost');
	const sslFlag = env('POSTGRES_SSL').toLowerCase();
	const useSsl =
		sslFlag === 'true' ||
		sslFlag === '1' ||
		(sslFlag !== 'false' &&
			(host.includes('render.com') || host.includes('amazonaws.com')));

	const root = join(__dirname, '..');

	return {
		type: 'postgres',
		host,
		port: Number(env('POSTGRES_PORT', '5432')),
		username: env('POSTGRES_USER'),
		password: env('POSTGRES_PASSWORD'),
		database: env('POSTGRES_DB'),
		ssl: useSsl ? { rejectUnauthorized: false } : false,
		entities: [join(root, '**', '*.entity.{ts,js}')],
		migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
		synchronize: envBool('DB_SYNCHRONIZE', false),
		logging: envBool('DB_LOGGING', true),
		migrationsTableName: 'typeorm_migrations',
		migrationsRun: envBool('DB_MIGRATIONS_RUN', false),
		...overrides,
	} as DataSourceOptions;
}

/** NestJS TypeOrmModule extras (not valid on raw DataSource). */
export function nestTypeOrmExtra() {
	return {
		autoLoadEntities: true as const,
		retryAttempts: 5,
		retryDelay: 3000,
	};
}

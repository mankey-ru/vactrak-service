import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Baseline schema for multi-user auth + vacancy ownership.
 * Uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS so it is safe on DBs
 * that were previously created with synchronize or manual SQL.
 */
export class InitAuthAndVacancyOwner1730000000000 implements MigrationInterface {
	name = 'InitAuthAndVacancyOwner1730000000000';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS users (
				id BIGSERIAL PRIMARY KEY,
				telegram_id BIGINT NOT NULL,
				username VARCHAR NULL,
				first_name VARCHAR NULL,
				last_name VARCHAR NULL,
				photo_url VARCHAR NULL,
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				CONSTRAINT uq_users_telegram_id UNIQUE (telegram_id)
			)
		`);

		await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS api_tokens (
				id BIGSERIAL PRIMARY KEY,
				user_id BIGINT NOT NULL,
				token_hash VARCHAR(64) NOT NULL,
				label VARCHAR NULL,
				token_prefix VARCHAR(16) NOT NULL,
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				revoked_at TIMESTAMP NULL,
				CONSTRAINT uq_api_tokens_token_hash UNIQUE (token_hash),
				CONSTRAINT fk_api_tokens_user
					FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			)
		`);

		// Core vacancy table (legacy installs may already have it)
		await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS vacancy (
				id BIGSERIAL PRIMARY KEY,
				id_ext VARCHAR NOT NULL,
				title VARCHAR NOT NULL,
				company VARCHAR NOT NULL,
				filter_json JSONB NOT NULL,
				source VARCHAR NOT NULL,
				search_key VARCHAR NULL,
				date_fetched TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			)
		`);

		await queryRunner.query(`
			ALTER TABLE vacancy
				ADD COLUMN IF NOT EXISTS user_id BIGINT NULL
		`);

		await queryRunner.query(`
			ALTER TABLE vacancy
				ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'new'
		`);

		// FK only if missing (Postgres has no ADD CONSTRAINT IF NOT EXISTS)
		await queryRunner.query(`
			DO $$
			BEGIN
				IF NOT EXISTS (
					SELECT 1 FROM pg_constraint WHERE conname = 'fk_vacancy_user'
				) THEN
					ALTER TABLE vacancy
						ADD CONSTRAINT fk_vacancy_user
						FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
				END IF;
			END $$
		`);

		await queryRunner.query(`
			CREATE INDEX IF NOT EXISTS idx_vacancy_user_id_ext_source_title
				ON vacancy (user_id, id_ext, source, title)
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			DROP INDEX IF EXISTS idx_vacancy_user_id_ext_source_title
		`);

		await queryRunner.query(`
			ALTER TABLE vacancy DROP CONSTRAINT IF EXISTS fk_vacancy_user
		`);

		// Keep vacancy rows; only drop auth-era columns (optional rollback)
		await queryRunner.query(`
			ALTER TABLE vacancy DROP COLUMN IF EXISTS status
		`);
		await queryRunner.query(`
			ALTER TABLE vacancy DROP COLUMN IF EXISTS user_id
		`);

		await queryRunner.query(`DROP TABLE IF EXISTS api_tokens`);
		await queryRunner.query(`DROP TABLE IF EXISTS users`);
	}
}

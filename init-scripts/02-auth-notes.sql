-- Dev uses TypeORM synchronize (DB_SYNCHRONIZE=true).
-- If you already have vacancy rows without user_id, either wipe the table
-- or backfill before making user_id NOT NULL, e.g.:
--
-- INSERT INTO users (telegram_id, first_name)
-- VALUES ('YOUR_TELEGRAM_ID', 'Owner')
-- ON CONFLICT DO NOTHING;
--
-- ALTER TABLE vacancy ADD COLUMN IF NOT EXISTS user_id bigint;
-- ALTER TABLE vacancy ADD COLUMN IF NOT EXISTS status varchar(32) DEFAULT 'new';
-- UPDATE vacancy SET user_id = (SELECT id FROM users ORDER BY id LIMIT 1) WHERE user_id IS NULL;
-- ALTER TABLE vacancy ALTER COLUMN user_id SET NOT NULL;

select 'auth schema managed by TypeORM entities (users, api_tokens, vacancy.user_id/status)' as result;

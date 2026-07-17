select 'This is 01-init.sql' as result;
-- CREATE TABLE IF NOT EXISTS vacancy (
-- 	id BIGSERIAL PRIMARY KEY,
-- 	id_ext varchar NOT NULL,
-- 	title varchar NOT NULL,
-- 	company varchar NOT NULL,
-- 	filter_json jsonb NOT NULL,
-- 	date_fetched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- 	source varchar NOT NULL DEFAULT 'hh'
-- );

-- COMMENT ON TABLE vacancy IS 'Вакансии из внешних источников (например, HH.ru, LinkedIn и т.д.)';

-- COMMENT ON COLUMN vacancy.id           IS 'Внутренний автоинкрементный ID';
-- COMMENT ON COLUMN vacancy.id_ext       IS 'Внешний ID вакансии';
-- COMMENT ON COLUMN vacancy.title        IS 'Название вакансии';
-- COMMENT ON COLUMN vacancy.company      IS 'Название компании';
-- COMMENT ON COLUMN vacancy.filter_json  IS 'JSON с фильтрами и метаданными поиска';
-- COMMENT ON COLUMN vacancy.date_fetched IS 'Дата и время когда вакансия была спарсена';
-- COMMENT ON COLUMN vacancy.source 	   IS 'Источник вакансии (hh, habr)';

-- INSERT INTO vacancy (id_ext, title, company, filter_json, source) VALUES 
-- ('12345', 'Рэпер', 'Газпром', '{"enable_snippets":"true","ored_clusters":"true","work_format":"REMOTE","order_by":"publication_time","hhtmFromLabel":"chip_filter","hhtmFrom":"vacancy_search_list","search_field":"name","hhtmSource":"vacancy_search_list","hhtmSourceLabel":"vacancy_search_list","text":"node","experience":["between3And6","moreThan6"]}', 'hh'),
-- ('67890', 'Металлист', 'Яндекс', '{"enable_snippets":"true","ored_clusters":"true","work_format":"REMOTE","order_by":"publication_time","hhtmFromLabel":"chip_filter","hhtmFrom":"vacancy_search_list","search_field":"name","hhtmSource":"vacancy_search_list","hhtmSourceLabel":"vacancy_search_list","text":"vue","experience":["between3And6","moreThan6"]}', 'hh')
-- ON CONFLICT DO NOTHING;
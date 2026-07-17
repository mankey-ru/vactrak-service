import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import type { FilterJson } from '@hhvac/vac.types';

@Entity('vacancy')
export class Vacancy {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	/** это внутренний id в таблице */
	id!: string; // bigint лучше хранить как string в JS/TS

	@Column({ type: 'varchar', nullable: false })
	/** это id на хедхантере */
	id_ext!: string;

	@Column({ type: 'varchar', nullable: false })
	/** название вакансии */
	title!: string;

	@Column({ type: 'varchar', nullable: false })
	/** название компании */
	company!: string;

	@Column({ type: 'jsonb', nullable: false })
	/** фильтр вакансий */
	filter_json!: FilterJson;

	@Column({ type: 'varchar', nullable: false })
	/** источник */
	source!: 'hh' | 'habr';

	@Column({ type: 'varchar', nullable: false, default: '<none>' })
	/** код поиска */
	search_code!: string;

	@CreateDateColumn({
		type: 'timestamp',
		name: 'date_fetched',
		default: () => 'CURRENT_TIMESTAMP',
	})
	date_fetched!: Date;
}
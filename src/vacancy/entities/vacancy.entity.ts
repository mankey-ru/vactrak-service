import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	Index,
} from 'typeorm';
import type { FilterJson, VacancySource, VacancyStatus } from '../vacancy.types';
import { User } from '@/user/entities/user.entity';

@Entity('vacancy')
@Index(['userId', 'id_ext', 'source', 'title'])
export class Vacancy {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	/** внутренний id в таблице */
	id!: string; // bigint как string в JS/TS

	@Column({ type: 'bigint', name: 'user_id' })
	userId!: string;

	@ManyToOne(() => User, (user) => user.vacancies, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User;

	@Column({ type: 'varchar', nullable: false })
	/** внешний id на источнике */
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
	source!: VacancySource;

	@Column({ type: 'varchar', nullable: true })
	/** ключ поискового запроса */
	search_key?: string;

	@Column({ type: 'varchar', length: 32, default: 'new' })
	/** pipeline status for "my vacancies" */
	status!: VacancyStatus;

	@CreateDateColumn({
		type: 'timestamp',
		name: 'date_fetched',
		default: () => 'CURRENT_TIMESTAMP',
	})
	date_fetched!: Date;
}

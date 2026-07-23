import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
} from 'typeorm';
import { Vacancy } from '@/vacancy/entities/vacancy.entity';
import { ApiToken } from './api-token.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id!: string;

	/** Telegram user id (from Login Widget / Bot API) */
	@Column({ type: 'bigint', unique: true, name: 'telegram_id' })
	telegramId!: string;

	@Column({ type: 'varchar', nullable: true })
	username?: string | null;

	@Column({ type: 'varchar', name: 'first_name', nullable: true })
	firstName?: string | null;

	@Column({ type: 'varchar', name: 'last_name', nullable: true })
	lastName?: string | null;

	@Column({ type: 'varchar', name: 'photo_url', nullable: true })
	photoUrl?: string | null;

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt!: Date;

	@OneToMany(() => Vacancy, (vacancy) => vacancy.user)
	vacancies?: Vacancy[];

	@OneToMany(() => ApiToken, (token) => token.user)
	apiTokens?: ApiToken[];
}

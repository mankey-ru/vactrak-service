import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('api_tokens')
export class ApiToken {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id!: string;

	@Column({ type: 'bigint', name: 'user_id' })
	userId!: string;

	@ManyToOne(() => User, (user) => user.apiTokens, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User;

	/** SHA-256 hex of the raw token (raw value shown only once at creation) */
	@Column({ type: 'varchar', length: 64, unique: true, name: 'token_hash' })
	tokenHash!: string;

	/** Optional label, e.g. "userscript laptop" */
	@Column({ type: 'varchar', nullable: true })
	label?: string | null;

	/** First 8 chars of raw token for display (not secret) */
	@Column({ type: 'varchar', length: 16, name: 'token_prefix' })
	tokenPrefix!: string;

	@CreateDateColumn({ type: 'timestamp', name: 'created_at' })
	createdAt!: Date;

	@Column({ type: 'timestamp', name: 'revoked_at', nullable: true })
	revokedAt?: Date | null;
}

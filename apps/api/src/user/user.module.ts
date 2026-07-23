import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiToken } from './entities/api-token.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, ApiToken])],
	exports: [TypeOrmModule],
})
export class UserModule {}

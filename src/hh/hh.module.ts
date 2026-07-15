import { Module } from '@nestjs/common';
import { VacController } from './vac/vac.controller';
import { VacService } from './vac/vac.service';

@Module({
	controllers: [VacController],
	providers: [VacService],
})
export class HhModule {}

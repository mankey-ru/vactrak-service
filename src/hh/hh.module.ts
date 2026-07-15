import { Module } from '@nestjs/common';
import { VacController } from './vac/vac.controller';
import { VacService } from './vac/vac.service';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
	imports: [TelegramModule],
	controllers: [VacController],
	providers: [VacService],
})
export class HhModule {}

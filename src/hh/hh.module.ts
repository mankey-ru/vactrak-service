import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { VacController } from './vac/vac.controller';
import { VacService } from './vac/vac.service';
import { TelegramModule } from '../telegram/telegram.module';
import { HhCorsMiddleware } from './hh-cors.middleware';

@Module({
	imports: [TelegramModule],
	controllers: [VacController],
	providers: [VacService],
})
export class HhModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HhCorsMiddleware).forRoutes(VacController);
	}
}

// export class HhModule {}

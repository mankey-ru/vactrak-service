import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HhModule } from './hh/hh.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TelegramModule,
		HhModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

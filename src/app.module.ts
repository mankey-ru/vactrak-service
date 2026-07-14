import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HhModule } from './hh/hh.module';

@Module({
  imports: [HhModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

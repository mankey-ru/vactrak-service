import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/info')
	getInfo (): Record<string, any> {
		return this.appService.getInfo();
	}
}

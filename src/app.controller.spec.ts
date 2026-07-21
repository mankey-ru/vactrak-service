import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('/info', () => {
		it('should return version', () => {
			expect(appController.getInfo ()).toHaveProperty('version');
			// {"env": "test", "status": "ok", "uptime": "12 sec.", "version": "1.0.2"}
		});
	});
});

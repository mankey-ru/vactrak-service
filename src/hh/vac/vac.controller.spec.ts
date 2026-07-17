import { Test, TestingModule } from '@nestjs/testing';
import { VacController } from '@hhvac/vac.controller';
import { VacService } from '@hhvac/vac.service';
import { TelegramService } from '@/telegram/telegram.service';
import { TelegramNotificationInterceptor } from '@/telegram/telegram-notification.interceptor';

describe('VacController', () => {
	let controller: VacController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VacController],
			providers: [
				VacService,
				TelegramNotificationInterceptor,
				{
					provide: TelegramService,
					useValue: {
						sendRequestNotification: jest.fn().mockResolvedValue(undefined),
					},
				},
			],
		}).compile();

		controller = module.get<VacController>(VacController);
	});

	it('should return vacancy by id', () => {
		expect(controller.getVacancy(12345)).toEqual({
			id: 12345,
			status: 'MY_STATUS',
			date_added: '2026-07-14T22:00:48.228Z',
		});
	});

	it('should create vacancy', async () => {
		await expect(
			controller.createVacancy({ vacancyList: [{ id_ext: '123', title: 'Backend', company: 'Yandex', filter_json: {a: '1'}, source: 'hh' }] }),
		).resolves.toEqual({
			result: 'CREATED',
		});
	});
});

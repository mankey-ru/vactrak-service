import { Test, TestingModule } from '@nestjs/testing';
import { HhController } from './hh.controller';
import { VacancyService } from '@/vacancy/vacancy.service';
import { TelegramService } from '@/telegram/telegram.service';
import { TelegramNotificationInterceptor } from '@/telegram/telegram-notification.interceptor';

describe('HhController', () => {
	let controller: HhController;
	const vacancyService = {
		getById: jest.fn((vacancyId: number) => ({
			id: vacancyId,
			status: 'MY_STATUS',
			date_added: '2026-07-14T22:00:48.228Z',
		})),
		getAll: jest.fn(),
		create: jest.fn().mockResolvedValue({
			result: 'CREATED',
			vacancyList: [{ id: '1', id_ext: '123', title: 'Backend' }],
		}),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			controllers: [HhController],
			providers: [
				{ provide: VacancyService, useValue: vacancyService },
				TelegramNotificationInterceptor,
				{
					provide: TelegramService,
					useValue: {
						sendRequestNotification: jest.fn().mockResolvedValue(undefined),
					},
				},
			],
		}).compile();

		controller = module.get<HhController>(HhController);
	});

	it('should return vacancy by id', () => {
		expect(controller.getVacancy(12345)).toEqual({
			id: 12345,
			status: 'MY_STATUS',
			date_added: '2026-07-14T22:00:48.228Z',
		});
	});

	it('should create vacancy with source forced to hh', async () => {
		await expect(
			controller.createVacancy({
				vacancyList: [
					{
						id_ext: '123',
						title: 'Backend',
						company: 'Yandex',
						filter_json: { a: '1' },
						source: 'habr',
					},
				],
			}),
		).resolves.toEqual({
			result: 'CREATED',
			vacancyList: [{ id: '1', id_ext: '123', title: 'Backend' }],
		});

		expect(vacancyService.create).toHaveBeenCalledWith({
			vacancyList: [
				expect.objectContaining({
					id_ext: '123',
					source: 'hh',
				}),
			],
		});
	});
});

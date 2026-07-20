import { Test, TestingModule } from '@nestjs/testing';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';

describe('VacancyController', () => {
	let controller: VacancyController;
	const vacancyService = {
		getById: jest.fn((vacancyId: number) =>
			Promise.resolve({
				id: String(vacancyId),
				id_ext: '123',
				title: 'Backend',
				company: 'Yandex',
				filter_json: {},
				source: 'hh' as const,
				date_fetched: new Date('2026-07-14T22:00:48.228Z'),
			}),
		),
		getAllVacancies: jest.fn().mockResolvedValue([
			{
				id: '666',
				id_ext: '123',
				title: 'Backend',
				company: 'Yandex',
				filter_json: {},
				source: 'hh',
				date_fetched: new Date('2026-07-14T22:00:48.228Z'),
			},
		]),
		create: jest.fn().mockResolvedValue({
			result: 'CREATED',
			vacancyList: [{ id: '1', id_ext: '123', title: 'Backend' }],
		}),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VacancyController],
			providers: [{ provide: VacancyService, useValue: vacancyService }],
		}).compile();

		controller = module.get<VacancyController>(VacancyController);
	});

	it('should return vacancy by id', async () => {
		await expect(controller.getVacancy(12345)).resolves.toEqual({
			id: '12345',
			id_ext: '123',
			title: 'Backend',
			company: 'Yandex',
			filter_json: {},
			source: 'hh',
			date_fetched: new Date('2026-07-14T22:00:48.228Z'),
		});
		expect(vacancyService.getById).toHaveBeenCalledWith(12345);
	});

	it('should return paginated vacancies', async () => {
		await expect(controller.getAllVacancy({ pageSize: 25, page: 1 })).resolves.toEqual([
			{
				id: '666',
				id_ext: '123',
				title: 'Backend',
				company: 'Yandex',
				filter_json: {},
				source: 'hh',
				date_fetched: new Date('2026-07-14T22:00:48.228Z'),
			},
		]);
		expect(vacancyService.getAllVacancies).toHaveBeenCalledWith(25, 1, undefined);
	});

	it('should pass source filter to getAllVacancies', async () => {
		await controller.getAllVacancy({
			pageSize: 50,
			page: 2,
			source: 'hh',
		});
		expect(vacancyService.getAllVacancies).toHaveBeenCalledWith(50, 2, 'hh');
	});

	it('should create vacancy', async () => {
		const body = {
			vacancyList: [
				{
					id_ext: '123',
					title: 'Backend',
					company: 'Yandex',
					filter_json: { a: '1' },
					source: 'hh' as const,
				},
			],
		};

		await expect(controller.createVacancy(body)).resolves.toEqual({
			result: 'CREATED',
			vacancyList: [{ id: '1', id_ext: '123', title: 'Backend' }],
		});

		expect(vacancyService.create).toHaveBeenCalledWith(body);
	});
});

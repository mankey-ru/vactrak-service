import { Test, TestingModule } from '@nestjs/testing';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { CombinedAuthGuard } from '@/auth/guards/combined-auth.guard';
import type { AuthUser } from '@/auth/auth.types';

describe('VacancyController', () => {
	let controller: VacancyController;
	const user: AuthUser = {
		id: '7',
		telegramId: '150485101',
		firstName: 'Test',
	};
	const vacancyService = {
		getById: jest.fn((vacancyId: number, userId: string) =>
			Promise.resolve({
				id: String(vacancyId),
				userId,
				id_ext: '123',
				title: 'Backend',
				company: 'Yandex',
				filter_json: {},
				source: 'hh' as const,
				status: 'new' as const,
				date_fetched: new Date('2026-07-14T22:00:48.228Z'),
			}),
		),
		getAllVacancies: jest.fn().mockResolvedValue([
			{
				id: '666',
				userId: '7',
				id_ext: '123',
				title: 'Backend',
				company: 'Yandex',
				filter_json: {},
				source: 'hh',
				status: 'new',
				date_fetched: new Date('2026-07-14T22:00:48.228Z'),
			},
		]),
		create: jest.fn().mockResolvedValue({
			result: 'CREATED',
			vacancyList: [{ id: '1', id_ext: '123', title: 'Backend', status: 'new' }],
		}),
		updateStatus: jest.fn((vacancyId: number, userId: string, status: 'new' | 'archived') =>
			Promise.resolve({
				id: String(vacancyId),
				userId,
				status,
				id_ext: '123',
				title: 'Backend',
				company: 'Yandex',
				filter_json: {},
				source: 'hh' as const,
				date_fetched: new Date('2026-07-14T22:00:48.228Z'),
			}),
		),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VacancyController],
			providers: [{ provide: VacancyService, useValue: vacancyService }],
		})
			.overrideGuard(CombinedAuthGuard)
			.useValue({ canActivate: () => true })
			.compile();

		controller = module.get<VacancyController>(VacancyController);
	});

	it('should return vacancy by id for owner', async () => {
		await expect(controller.getVacancy(12345, user)).resolves.toMatchObject({
			id: '12345',
			userId: '7',
			title: 'Backend',
		});
		expect(vacancyService.getById).toHaveBeenCalledWith(12345, '7');
	});

	it('should return paginated vacancies for user', async () => {
		await expect(controller.getAllVacancy({ pageSize: 25, page: 1 }, user)).resolves.toEqual([
			{
				id: '666',
				userId: '7',
				id_ext: '123',
				title: 'Backend',
				company: 'Yandex',
				filter_json: {},
				source: 'hh',
				status: 'new',
				date_fetched: new Date('2026-07-14T22:00:48.228Z'),
			},
		]);
		expect(vacancyService.getAllVacancies).toHaveBeenCalledWith(
			'7',
			25,
			1,
			undefined,
			undefined,
		);
	});

	it('should pass source and status filters with user id', async () => {
		await controller.getAllVacancy(
			{
				pageSize: 50,
				page: 2,
				source: 'hh',
				status: 'archived',
			},
			user,
		);
		expect(vacancyService.getAllVacancies).toHaveBeenCalledWith(
			'7',
			50,
			2,
			'hh',
			'archived',
		);
	});

	it('should create vacancy for user', async () => {
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

		await expect(controller.createVacancy(body, user)).resolves.toEqual({
			result: 'CREATED',
			vacancyList: [{ id: '1', id_ext: '123', title: 'Backend', status: 'new' }],
		});

		expect(vacancyService.create).toHaveBeenCalledWith(body, user);
	});

	it('should update status', async () => {
		await expect(
			controller.updateStatus(9, { status: 'archived' }, user),
		).resolves.toMatchObject({
			id: '9',
			status: 'archived',
			userId: '7',
		});
		expect(vacancyService.updateStatus).toHaveBeenCalledWith(9, '7', 'archived');
	});
});

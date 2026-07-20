import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Vacancy } from '../src/vacancy/entities/vacancy.entity';
import { TelegramService } from '../src/telegram/telegram.service';

describe('Vacancy POST (e2e)', () => {
	let app: INestApplication;
	let vacancyRepo: Repository<Vacancy>;
	let createdId: string | undefined;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(TelegramService)
			.useValue({
				sendRequestNotification: jest.fn().mockResolvedValue(undefined),
			})
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();

		vacancyRepo = moduleFixture.get<Repository<Vacancy>>(getRepositoryToken(Vacancy));
	});

	afterAll(async () => {
		if (createdId) {
			await vacancyRepo.delete(createdId);
		}
		await app.close();
	});

	it('POST /api/vac persists vacancy fields in the database', async () => {
		const idExt = String(Date.now());
		const payload = {
			vacancyList: [
				{
					id_ext: Number(idExt),
					title: 'Integration Test Backend',
					company: 'TestCo',
					filter_json: {
						text: 'node',
						work_format: 'REMOTE',
						experience: ['between3And6'],
					},
					source: 'hh',
					search_key: 'itest-node',
				},
			],
		};

		const res = await request(app.getHttpServer()).post('/api/vac').send(payload).expect(201);

		expect(res.body).toMatchObject({
			result: 'CREATED',
			vacancyList: [
				{
					id_ext: expect.anything(),
					title: 'Integration Test Backend',
				},
			],
		});
		expect(res.body.vacancyList).toHaveLength(1);
		expect(res.body.vacancyList[0].id).toBeDefined();

		createdId = String(res.body.vacancyList[0].id);

		const row = await vacancyRepo.findOneBy({ id: createdId });
		expect(row).not.toBeNull();

		expect(row!.id).toBe(createdId);
		expect(String(row!.id_ext)).toBe(idExt);
		expect(row!.title).toBe('Integration Test Backend');
		expect(row!.company).toBe('TestCo');
		expect(row!.source).toBe('hh');
		expect(row!.search_key).toBe('itest-node');
		expect(row!.filter_json).toEqual({
			text: 'node',
			work_format: 'REMOTE',
			experience: ['between3And6'],
		});
		expect(row!.date_fetched).toBeInstanceOf(Date);
		expect(Number.isNaN(row!.date_fetched.getTime())).toBe(false);
	});
});

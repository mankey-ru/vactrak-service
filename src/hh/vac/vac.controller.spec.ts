import { Test, TestingModule } from '@nestjs/testing';
import { VacController } from './vac.controller';
import { VacService } from './vac.service';

describe('VacController', () => {
  let controller: VacController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacController],
      providers: [VacService],
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
});

import { Test, TestingModule } from '@nestjs/testing';
import { HgInjectionController } from './hg-injection.controller';
import { HgInjectionService } from './hg-injection.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HgInjectionBaseDTO, HgInjectionDTO } from '../dto/hg-injection.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HgInjectionRepository } from './hg-injection.repository';

const locId = '';
const testSumId = '';
const hgTestSumId = '';
const hgTestInjId = '';
const id = '';
const dto = new HgInjectionDTO();

const payload = new HgInjectionBaseDTO();

const mockService = () => ({
  getHgInjection: jest.fn().mockResolvedValue(dto),
  getHgInjections: jest.fn().mockResolvedValue([dto]),
  getHgInjectionsByHgTestSumId: jest.fn().mockResolvedValue([dto]),
  getHgInjectionsByHgSumIds: jest.fn().mockResolvedValue([dto]),
});

describe('HgInjectionController', () => {
  let controller: HgInjectionController;
  let service: HgInjectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [HgInjectionController],
      providers: [
        HgInjectionRepository,
        ConfigService,
        AuthGuard,
        {
          provide: HgInjectionService,
          useFactory: mockService,
        },
        {
          provide: HgInjectionService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<HgInjectionController>(HgInjectionController);
    service = module.get<HgInjectionService>(HgInjectionService);
  });

  describe('getHgInjectionsByHgTestSumId', () => {
    it('Should get Hg Injections by Hg Test Sum Id', async () => {
      const result = await controller.getHgInjections(
        locId,
        testSumId,
        hgTestSumId,
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('getHgInjection', () => {
    it('Should get an Hg Injection Record', async () => {
      const result = await controller.getHgInjection(
        locId,
        testSumId,
        hgTestSumId,
        hgTestInjId,
      );
      expect(result).toEqual(dto);
    });
  });
});

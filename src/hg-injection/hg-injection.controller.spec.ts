import { Test, TestingModule } from '@nestjs/testing';
import { HgInjectionController } from './hg-Injection.controller';
import { HgInjectionService } from './hg-Injection.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HgInjectionBaseDTO, HgInjectionDTO } from '../dto/hg-Injection.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const hgTestSumId = '';
const id = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};
const dto = new HgInjectionDTO();

const payload = new HgInjectionBaseDTO();

const mockService = () => ({
  getHgInjection: jest.fn().mockResolvedValue(dto),
  getHgSummaries: jest.fn().mockResolvedValue([dto]),
});

describe('HgInjectionController', () => {
  let controller: HgInjectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [HgInjectionController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: HgInjectionService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<HgInjectionController>(HgInjectionController);
  });

  describe('getHgInjection', () => {
    it('Calls the service to get a Cycle Time Injection record', async () => {
      const result = await controller.getHgInjection(locId, hgTestSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getHgSummaries', () => {
    it('Calls the service to many Cycle Time Injection records', async () => {
      const result = await controller.getHgInjections(locId, hgTestSumId);
      expect(result).toEqual([dto]);
    });
  });
});

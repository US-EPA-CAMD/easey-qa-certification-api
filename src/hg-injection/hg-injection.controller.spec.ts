import { Test, TestingModule } from '@nestjs/testing';
import { HgInjectionController } from './hg-injection.controller';
import { HgInjectionService } from './hg-injection.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HgInjectionBaseDTO, HgInjectionDTO } from '../dto/hg-injection.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const testSumId = '';
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
  getHgInjectionsByHgTestSumId: jest.fn().mockResolvedValue([dto]),
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
    it('Calls the service to get a HG Injection record', async () => {
      const result = await controller.getHgInjection(
        locId,
        testSumId,
        hgTestSumId,
        id,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('getHgInjections', () => {
    it('Calls the service to many HG Injection records', async () => {
      const result = await controller.getHgInjectionsByHgTestSumId(
        locId,
        testSumId,
        hgTestSumId,
      );
      expect(result).toEqual([dto]);
    });
  });
});

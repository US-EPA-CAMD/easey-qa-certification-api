import { Test, TestingModule } from '@nestjs/testing';
import { HgSummaryController } from './hg-summary.controller';
import { HgSummaryService } from './hg-summary.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HgSummaryBaseDTO, HgSummaryDTO } from '../dto/hg-summary.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const testSumId = '';
const id = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};
const dto = new HgSummaryDTO();

const payload = new HgSummaryBaseDTO();

const mockService = () => ({
  getHgSummary: jest.fn().mockResolvedValue(dto),
  getHgSummaries: jest.fn().mockResolvedValue([dto]),
});

describe('HgSummaryController', () => {
  let controller: HgSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [HgSummaryController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: HgSummaryService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<HgSummaryController>(HgSummaryController);
  });

  describe('getHgSummary', () => {
    it('Calls the service to get a Cycle Time Summary record', async () => {
      const result = await controller.getHgSummary(locId, testSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getHgSummaries', () => {
    it('Calls the service to many Cycle Time Summary records', async () => {
      const result = await controller.getHgSummaries(locId, testSumId);
      expect(result).toEqual([dto]);
    });
  });
});

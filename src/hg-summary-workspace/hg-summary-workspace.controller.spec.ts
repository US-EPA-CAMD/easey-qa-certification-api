import { Test, TestingModule } from '@nestjs/testing';
import { HgSummaryWorkspaceController } from './hg-summary-workspace.controller';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';
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
  createHgSummary: jest.fn().mockResolvedValue(dto),
  updateHgSummary: jest.fn().mockResolvedValue(dto),
});

describe('HgSummaryWorkspaceController', () => {
  let controller: HgSummaryWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [HgSummaryWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: HgSummaryWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<HgSummaryWorkspaceController>(
      HgSummaryWorkspaceController,
    );
  });

  describe('createHgSummary', () => {
    it('Calls the service and create a new Hg Summary record', async () => {
      const result = await controller.createHgSummary(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateHgSummary', () => {
    it('Calls the service and update a existing Hg Summary record', async () => {
      const result = await controller.updateHgSummary(
        locId,
        testSumId,
        id,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });
});

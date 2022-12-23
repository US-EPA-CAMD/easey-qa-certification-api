import { Test, TestingModule } from '@nestjs/testing';

import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HgInjectionBaseDTO, HgInjectionDTO } from 'src/dto/hg-injection.dto';
import { HgInjectionWorkspaceController } from './hg-injection-workspace.controller';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

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
  createHgInjection: jest.fn().mockResolvedValue(dto),
  updateHgInjection: jest.fn().mockResolvedValue(dto),
  getHgInjection: jest.fn().mockResolvedValue(dto),
  getHgInjections: jest.fn().mockResolvedValue([dto]),
});

describe('HgInjectionWorkspaceController', () => {
  let controller: HgInjectionWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [HgInjectionWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: HgInjectionWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<HgInjectionWorkspaceController>(
      HgInjectionWorkspaceController,
    );
  });

  describe('getHgInjection', () => {
    it('Calls the service to get a Cycle Time Injection record', async () => {
      const result = await controller.getHgInjection(locId, hgTestSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getHgInjections', () => {
    it('Calls the service to many Cycle Time Injection records', async () => {
      const result = await controller.getHgInjections(locId, hgTestSumId);
      expect(result).toEqual([dto]);
    });
  });

  describe('createHgInjection', () => {
    it('Calls the service and create a new Hg Injection record', async () => {
      const result = await controller.createHgInjection(
        locId,
        hgTestSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateHgInjection', () => {
    it('Calls the service and update a existing Hg Injection record', async () => {
      const result = await controller.updateHgInjection(
        locId,
        hgTestSumId,
        id,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HgInjectionBaseDTO, HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjectionWorkspaceController } from './hg-injection-workspace.controller';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

const locId = '';
const hgTestSumId = '';
const testSumId = '';
const hgTestInjId = '';
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
  getHgInjectionsByHgTestSumId: jest.fn().mockResolvedValue([dto]),
  deleteHgInjection: jest.fn().mockResolvedValue(null),
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
    it('Calls the service to get a Hg Injection record', async () => {
      const result = await controller.getHgInjection(
        locId,
        testSumId,
        hgTestSumId,
        hgTestInjId,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('getHgInjectionsByHgTestSumId', () => {
    it('Calls the service to many Hg Injection records', async () => {
      const result = await controller.getHgInjectionsByTestSumId(
        locId,
        testSumId,
        hgTestSumId,
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('createHgInjection', () => {
    it('Calls the service and create a new Hg record', async () => {
      const result = await controller.createHgInjection(
        locId,
        testSumId,
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
        testSumId,
        hgTestSumId,
        hgTestInjId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('deleteHgInjection', () => {
    it('should delete Hg Injection record', async () => {
      const result = await controller.deleteHgInjection(
        locId,
        testSumId,
        hgTestSumId,
        hgTestInjId,
        user,
      );

      expect(result).toEqual(null);
    });
  });
});

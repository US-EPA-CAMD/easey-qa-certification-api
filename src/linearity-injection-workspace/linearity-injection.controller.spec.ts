import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import {
  LinearityInjectionBaseDTO,
  LinearityInjectionDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';

import { LinearityInjectionWorkspaceController } from './linearity-injection.controller';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

const locId = '';
const testSumId = '';
const linSumId = '';
const linInjDto = new LinearityInjectionDTO();

const payload: LinearityInjectionBaseDTO = {
  injectionDate: new Date(),
  injectionHour: 1,
  injectionMinute: 1,
  measuredValue: 1,
  referenceValue: 1,
};

const mockService = () => ({
  createInjection: jest.fn().mockResolvedValue(linInjDto),
});

const mockCheckService = () => ({
  runChecks: jest.fn().mockResolvedValue(null),
});

describe('Linearity Injection Controller', () => {
  let controller: LinearityInjectionWorkspaceController;
  let service: LinearityInjectionWorkspaceService;
  let checkService: LinearityInjectionChecksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LinearityInjectionWorkspaceController],
      providers: [
        LinearityInjectionWorkspaceRepository,
        {
          provide: LinearityInjectionWorkspaceService,
          useFactory: mockService,
        },
        ConfigService,
        {
          provide: LinearityInjectionChecksService,
          useFactory: mockCheckService,
        },
      ],
    }).compile();

    controller = module.get(LinearityInjectionWorkspaceController);
    service = module.get(LinearityInjectionWorkspaceService);
    checkService = module.get(LinearityInjectionChecksService);
  });

  describe('createLinearityInjection', () => {
    it('should create Linearity injection record', async () => {
      const spyCheckService = jest.spyOn(checkService, 'runChecks');
      const result = await controller.createLinearityInjection(
        locId,
        testSumId,
        linSumId,
        payload,
      );
      expect(result).toEqual(linInjDto);
      expect(spyCheckService).toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { QACertificationWorkspaceController } from './qa-certification.controller';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { QACertificationChecksService } from './qa-certification-checks.service';
import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

const qaCertDto = new QACertificationDTO();
const qaParamsDto = new QACertificationParamsDTO();
const payload = new QACertificationImportDTO();

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
  roles: [],
};

const qaSuppData = new QASuppData();
const location = {
  unitId: 'string',
  locationId: 'string',
  stackPipeId: 'string',
  systemIDs: ['string'],
  componentIDs: ['string'],
};

const mockService = () => ({
  import: jest.fn(),
  export: jest.fn(),
});

const mockCheckService = () => ({
  runChecks: jest.fn().mockResolvedValue(''),
});

describe('QA Certification Workspace Controller Test', () => {
  let controller: QACertificationWorkspaceController;
  let service: QACertificationWorkspaceService;
  let checkService: QACertificationChecksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QACertificationWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: QACertificationWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: QACertificationChecksService,
          useFactory: mockCheckService,
        },
      ],
    }).compile();

    controller = module.get(QACertificationWorkspaceController);
    service = module.get(QACertificationWorkspaceService);
    checkService = module.get(QACertificationChecksService);
  });

  describe('export', () => {
    it('should export QA & Cert Data', async () => {
      jest.spyOn(service, 'export').mockResolvedValue(qaCertDto);
      expect(await controller.export(qaParamsDto)).toBe(qaCertDto);
    });
  });

  describe('import', () => {
    it('should import QA & Cert Data', async () => {
      jest
        .spyOn(checkService, 'runChecks')
        .mockResolvedValue([[location], [qaSuppData]]);
      jest.spyOn(service, 'import').mockResolvedValue(undefined);
      expect(await controller.import(payload, user)).toBe(undefined);
    });
  });
});

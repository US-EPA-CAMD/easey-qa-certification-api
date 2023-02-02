import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { QACertificationEventBaseDTO } from '../dto/qa-certification-event.dto';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';

const locationId = '';
const payload = new QACertificationEventBaseDTO();
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
});

const mockService = () => ({
  lookupValues: jest
    .fn()
    .mockReturnValue([
      'reportPeriodId',
      'componentRecordId',
      'monitoringSystemRecordId',
    ]),
});

describe('QACertificationEventChecksService', () => {
  let service: QACertificationEventChecksService;
  let repository: QACertificationEventWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationEventChecksService,
        {
          provide: QACertificationEventWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: QACertificationEventWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(QACertificationEventChecksService);
    repository = module.get(QACertificationEventWorkspaceRepository);

    jest.spyOn(service, 'getErrorMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('QA Certification Event Checks', () => {
    it('Should pass all checks', async () => {
      const result = await service.runChecks(locationId, payload, false, false);
      expect(result).toEqual([]);
    });

    it('should return error message A for QACERT-11', async () => {
      let duplicate;
      jest
        .spyOn(repository, 'find')
        .mockImplementation(() => Promise.resolve([duplicate]));
      try {
        await service.runChecks(locationId, payload, false, false);
      } catch (err) {
        expect(err).toBeInstanceOf(LoggingException);
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});

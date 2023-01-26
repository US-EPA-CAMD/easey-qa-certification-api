import { Test, TestingModule } from '@nestjs/testing';
import { QaCertificationEventService } from './qa-certification-event.service';
import { QACertificationEventRepository } from './qa-certification-event.repository';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';
import { QACertificationEvent } from '../entities/qa-certification-event.entity';

const locationId = '';
const qaCertEventId = '';
const facilityId = 1;
const unitId = '121';

const entity = new QACertificationEvent();
const qaCertEventDTO = new QACertificationEventDTO();

const mockRepository = () => ({
  getQaCertEventsByUnitStack: jest.fn().mockResolvedValue([entity]),
  getQACertificationEventsByLocationId: jest.fn().mockResolvedValue([entity]),
  getQACertificationEventById: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(qaCertEventDTO),
  many: jest.fn().mockResolvedValue([qaCertEventDTO]),
});

describe('QaCertificationEventService', () => {
  let service: QaCertificationEventService;
  let repository: QACertificationEventRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QaCertificationEventService,
        {
          provide: QACertificationEventRepository,
          useFactory: mockRepository,
        },
        {
          provide: QACertificationEventMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<QaCertificationEventService>(
      QaCertificationEventService,
    );
    repository = module.get(QACertificationEventRepository);
  });

  describe('getCertEvent', () => {
    it('calls the repository.findOne() and get QA Certification Event by id', async () => {
      const result = await service.getQACertEvent(qaCertEventId);
      expect(result).toEqual(qaCertEventDTO);
    });

    it('should throw error when QA Certification Event not found', async () => {
      jest
        .spyOn(repository, 'getQACertificationEventById')
        .mockResolvedValue(null);

      let errored = false;

      try {
        await service.getQACertEvent(qaCertEventId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getQACertEventsByLocationId', () => {
    it('calls the repository.getQACertEvents() and get test Extension Exemptions by locationId', async () => {
      const result = await service.getQACertEventsByLocationId(locationId);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });

  describe('getQACertEvents', () => {
    it('calls the repository.getQACertEventsByUnitStack() and get qa certification events by locationId', async () => {
      const result = await service.getQACertEvents(facilityId, [unitId]);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });

  describe('export', () => {
    it('calls the repository.getQACertEventsByUnitStack() and get qa certification events by locationId', async () => {
      const returnedSummary = qaCertEventDTO;
      returnedSummary.id = qaCertEventId;

      const spySummaries = jest
        .spyOn(service, 'getQACertEvents')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
    });
  });

  describe('getQACertEvents', () => {
    it('calls the repository.getQACertEvents() and get QA Certification Event by locationId', async () => {
      const result = await service.getQACertEvents(facilityId);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });
});

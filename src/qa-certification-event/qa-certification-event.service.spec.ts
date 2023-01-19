import { Test, TestingModule } from '@nestjs/testing';
import { QaCertificationEventService } from './qa-certification-event.service';
import { QACertificationEventRepository } from './qa-certification-event.repository';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';

const qaCertEventDTO = new QACertificationEventDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([qaCertEventDTO]),
  findOne: jest.fn().mockResolvedValue(qaCertEventDTO),
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
        ,
        {
          provide: QACertificationEventMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<QaCertificationEventService>(
      QaCertificationEventService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

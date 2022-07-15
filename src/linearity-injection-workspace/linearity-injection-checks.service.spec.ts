import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';
import { LinearityInjectionBaseDTO } from '../dto/linearity-injection.dto';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';

const linSumId = '1';

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new LinearityInjection()),
});

describe('Linearity Injection Check Service Test', () => {
  let service: LinearityInjectionChecksService;
  let repository: LinearityInjectionWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearityInjectionChecksService,
        {
          provide: LinearityInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(LinearityInjectionChecksService);
    repository = module.get(LinearityInjectionWorkspaceRepository);
  });

  describe('Linearity Injection Checks', () => {
    const payload = new LinearityInjectionBaseDTO();
    it('Should pass all checks', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.runChecks(linSumId, payload);
      expect(result).toEqual([]);
    });
  });

  describe('LINEAR-33 Duplicate Linearity Injection (Result A)', () => {
    const payload = new LinearityInjectionBaseDTO();
    payload.injectionDate = new Date('2022-01-12');
    payload.injectionHour = 1;
    payload.injectionMinute = 1;

    const returnValue = new LinearityInjection();
    returnValue.injectionDate = new Date('2022-01-12');
    returnValue.injectionHour = 1;
    returnValue.injectionMinute = 1;

    it('Should get already exists error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);

      try {
        await service.runChecks(linSumId, payload);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Another Linearity Injection record already exists with the same injectionDate [${payload.injectionDate}], injectionHour [${payload.injectionHour}], injectionMinute [${payload.injectionMinute}].`,
        ]);
      }
    });
  });
});

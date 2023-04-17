import { Test, TestingModule } from '@nestjs/testing';
import { TestQualificationService } from './test-qualification.service';
import { TestQualificationDTO } from '../dto/test-qualification.dto';
import { TestQualificationRepository } from './test-qualification.repository';
import { TestQualificationMap } from '../maps/test-qualification.map';

const testSumId = 'd4e5f6';
const testQualificationId = 'a1b2c3';
const testQualificationRecord: TestQualificationDTO = new TestQualificationDTO();
const testQualifications: TestQualificationDTO[] = [testQualificationRecord];

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(testQualificationRecord),
  many: jest.fn().mockResolvedValue(testQualifications),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(testQualifications),
  findOne: jest.fn().mockResolvedValue(testQualificationRecord),
});

describe('TestQualificationService', () => {
  let service: TestQualificationService;
  let repository: TestQualificationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestQualificationService,
        {
          provide: TestQualificationRepository,
          useFactory: mockRepository,
        },
        {
          provide: TestQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<TestQualificationService>(TestQualificationService);
    repository = module.get<TestQualificationRepository>(
      TestQualificationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTestQualification', () => {
    it('Calls repository.findOne({id}) to get a single Test Qualification record', async () => {
      const result = await service.getTestQualification(testQualificationId);
      expect(result).toEqual(testQualificationRecord);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Test Qualification record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getTestQualification(testQualificationId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getTestQualifications', () => {
    it('Calls Repository to find all Test Qualification records for a given Test Summary ID', async () => {
      const results = await service.getTestQualifications(testSumId);
      expect(results).toEqual(testQualifications);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Export', () => {
    it('Should Export Test Qualification', async () => {
      jest
        .spyOn(service, 'getTestQualificationByTestSumIds')
        .mockResolvedValue([testQualificationRecord]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([testQualificationRecord]);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { TestQualificationDTO } from '../dto/test-qualification.dto';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestQualificationRepository } from './test-qualification.repository';
import { TestQualificationService } from './test-qualification.service';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

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
  findOneBy: jest.fn().mockResolvedValue(testQualificationRecord),
});

describe('TestQualificationService', () => {
  let service: TestQualificationService;
  let repository: TestQualificationRepository;
  let dataSource: DataSource;

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
        { provide: DataSource, useValue: dataSource },
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
    it('Calls repository.findOneBy({id}) to get a single Test Qualification record', async () => {
      const repo = mockRepository();  
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        );
      const result = await service.getTestQualification(testQualificationId);
      expect(result).toEqual(testQualificationRecord);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Test Qualification record not found', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)) 
        );
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
      const repo = mockRepository();  
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        );
      const results = await service.getTestQualifications(testSumId);
      expect(results).toEqual(testQualifications);
      expect(repo.find).toHaveBeenCalled();
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

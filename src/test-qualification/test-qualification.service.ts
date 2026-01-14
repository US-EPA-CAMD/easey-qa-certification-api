import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In, DataSource } from 'typeorm';

import { TestQualificationDTO } from '../dto/test-qualification.dto';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestQualificationRepository } from './test-qualification.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class TestQualificationService {
  constructor(
    private readonly repository: TestQualificationRepository,
    private readonly map: TestQualificationMap,
    private readonly dataSource: DataSource,
  ) {}

  async getTestQualifications(
    testSumId: string,
  ): Promise<TestQualificationDTO[]> {
    const records = await useSlaveRepository(this.dataSource, TestQualificationRepository, async (repository) => repository.find({
      where: { testSumId },
    }));

    return this.map.many(records);
  }

  async getTestQualification(id: string): Promise<TestQualificationDTO> {
    const result = await useSlaveRepository(this.dataSource, TestQualificationRepository, async (repository) => repository.findOneBy({ id }));

    if (!result) {
      throw new EaseyException(
        new Error(
          `Test Qualification record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getTestQualificationByTestSumIds(
    testSumIds: string[],
  ): Promise<TestQualificationDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<TestQualificationDTO[]> {
    return this.getTestQualificationByTestSumIds(testSumIds);
  }
}

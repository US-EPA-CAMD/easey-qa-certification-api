import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestQualificationRepository } from './test-qualification.repository';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestQualificationDTO } from '../dto/test-qualification.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class TestQualificationService {
  constructor(
    @InjectRepository(TestQualificationRepository)
    private readonly repository: TestQualificationRepository,
    private readonly map: TestQualificationMap,
  ) {}

  async getTestQualifications(
    testSumId: string,
  ): Promise<TestQualificationDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async getTestQualification(id: string): Promise<TestQualificationDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Test Qualification record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

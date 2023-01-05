import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitDefaultTestRecordDTO } from '../dto/unit-default-test.dto';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { UnitDefaultTestRepository } from './unit-default-test.repository';
import { In } from 'typeorm';

@Injectable()
export class UnitDefaultTestService {
  constructor(
    private readonly map: UnitDefaultTestMap,
    @InjectRepository(UnitDefaultTestRepository)
    private readonly repository: UnitDefaultTestRepository,
  ) {}

  async getUnitDefaultTests(
    testSumId: string,
  ): Promise<UnitDefaultTestRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getUnitDefaultTest(
    id: string,
    testSumId: string,
  ): Promise<UnitDefaultTestRecordDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Unit Default Test record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getUnitDefaultTestsByTestSumIds(
    testSumIds: string[],
  ): Promise<UnitDefaultTestRecordDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<UnitDefaultTestRecordDTO[]> {
    return this.getUnitDefaultTestsByTestSumIds(testSumIds);
  }
}

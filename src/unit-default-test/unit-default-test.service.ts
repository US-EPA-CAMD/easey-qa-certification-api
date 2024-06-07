import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import {
  UnitDefaultTestDTO,
  UnitDefaultTestRecordDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { UnitDefaultTestRunService } from '../unit-default-test-run/unit-default-test-run.service';
import { UnitDefaultTestRepository } from './unit-default-test.repository';

@Injectable()
export class UnitDefaultTestService {
  constructor(
    private readonly map: UnitDefaultTestMap,
    private readonly repository: UnitDefaultTestRepository,
    @Inject(forwardRef(() => UnitDefaultTestRunService))
    private readonly unitDefaultTestRunService: UnitDefaultTestRunService,
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
    const result = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(`Unit Default Test record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getUnitDefaultTestsByTestSumIds(
    testSumIds: string[],
  ): Promise<UnitDefaultTestDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<UnitDefaultTestDTO[]> {
    const unitDefaultTests = await this.getUnitDefaultTestsByTestSumIds(
      testSumIds,
    );

    const unitDefaultTestRuns = await this.unitDefaultTestRunService.export(
      unitDefaultTests.map(udtr => udtr.id),
    );

    unitDefaultTests.forEach(udt => {
      udt.unitDefaultTestRunData = unitDefaultTestRuns.filter(
        udtr => udtr.unitDefaultTestSumId === udt.id,
      );
    });
    return unitDefaultTests;
  }
}

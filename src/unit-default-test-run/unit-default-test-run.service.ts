import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import {
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunRecordDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { UnitDefaultTestRunRepository } from './unit-default-test-run.repository';

@Injectable()
export class UnitDefaultTestRunService {
  constructor(
    private readonly map: UnitDefaultTestRunMap,
    private readonly repository: UnitDefaultTestRunRepository,
  ) {}

  async getUnitDefaultTestRuns(
    unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunRecordDTO[]> {
    const records = await this.repository.find({
      where: { unitDefaultTestSumId },
    });

    return this.map.many(records);
  }

  async getUnitDefaultTestRun(
    id: string,
    unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    const result = await this.repository.findOneBy({
      id,
      unitDefaultTestSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Unit Default Test Run record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getUnitDefaultTestRunByUnitDefaultTestSumIds(
    unitDefaultTestSumIds: string[],
  ): Promise<UnitDefaultTestRunDTO[]> {
    const results = await this.repository.find({
      where: { unitDefaultTestSumId: In(unitDefaultTestSumIds) },
    });
    return this.map.many(results);
  }

  async export(
    unitDefaultTestSumIds: string[],
  ): Promise<UnitDefaultTestRunDTO[]> {
    return this.getUnitDefaultTestRunByUnitDefaultTestSumIds(
      unitDefaultTestSumIds,
    );
  }
}

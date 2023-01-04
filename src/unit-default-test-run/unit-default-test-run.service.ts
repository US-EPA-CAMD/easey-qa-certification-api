import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitDefaultTestRunRecordDTO } from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { UnitDefaultTestRunRepository } from './unit-default-test-run.repository';
import { In } from 'typeorm';

@Injectable()
export class UnitDefaultTestRunService {
  constructor(
    private readonly map: UnitDefaultTestRunMap,
    @InjectRepository(UnitDefaultTestRunRepository)
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
    const result = await this.repository.findOne({
      id,
      unitDefaultTestSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Unit Default Test Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

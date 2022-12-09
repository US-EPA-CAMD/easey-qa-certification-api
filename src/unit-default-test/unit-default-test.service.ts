import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitDefaultTestDTO } from 'src/dto/unit-default-test.dto';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { UnitDefaultTestRepository } from './unit-default-test.repository';

@Injectable()
export class UnitDefaultTestService {
  constructor(
    private readonly map: UnitDefaultTestMap,
    @InjectRepository(UnitDefaultTestRepository)
    private readonly repository: UnitDefaultTestRepository,
  ) {}

  async getUnitDefaultTests(testSumId: string): Promise<UnitDefaultTestDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getUnitDefaultTest(
    id: string,
    testSumId: string,
  ): Promise<UnitDefaultTestDTO> {
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
}

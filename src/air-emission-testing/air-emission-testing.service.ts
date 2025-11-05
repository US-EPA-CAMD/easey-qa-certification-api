import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In, DataSource } from 'typeorm';

import { AirEmissionTestingDTO } from '../dto/air-emission-test.dto';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { AirEmissionTestingRepository } from './air-emission-testing.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';

@Injectable()
export class AirEmissionTestingService {
  constructor(
    private readonly repository: AirEmissionTestingRepository,
    private readonly map: AirEmissionTestingMap,
    private readonly dataSource: DataSource
  ) {}

  async getAirEmissionTestings(
    testSumId: string,
  ): Promise<AirEmissionTestingDTO[]> {
    const records = await useSlaveRepository(this.dataSource, AirEmissionTestingRepository, async (repository) => repository.find({ where: { testSumId } }));
    return this.map.many(records);
  }

  async getAirEmissionTesting(id: string): Promise<AirEmissionTestingDTO> {
    const result = await useSlaveRepository(this.dataSource, AirEmissionTestingRepository, async (repository) => repository.findOneBy({ id }));

    if (!result) {
      throw new EaseyException(
        new Error(
          `Air Emissions Testing record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getAirEmissionTestingByTestSumIds(
    testSumIds: string[],
  ): Promise<AirEmissionTestingDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<AirEmissionTestingDTO[]> {
    return this.getAirEmissionTestingByTestSumIds(testSumIds);
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { AirEmissionTestingDTO } from '../dto/air-emission-test.dto';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { AirEmissionTestingRepository } from './air-emission-testing.repository';

@Injectable()
export class AirEmissionTestingService {
  constructor(
    @InjectRepository(AirEmissionTestingRepository)
    private readonly repository: AirEmissionTestingRepository,
    private readonly map: AirEmissionTestingMap,
  ) {}

  async getAirEmissionTestings(
    testSumId: string,
  ): Promise<AirEmissionTestingDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getAirEmissionTesting(id: string): Promise<AirEmissionTestingDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Air Emissions Testing record not found with Record Id [${id}].`,
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

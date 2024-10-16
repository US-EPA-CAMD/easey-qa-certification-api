import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { RataDTO } from '../dto/rata.dto';
import { RataMap } from '../maps/rata.map';
import { RataSummaryService } from '../rata-summary/rata-summary.service';
import { RataRepository } from './rata.repository';

@Injectable()
export class RataService {
  constructor(
    private readonly map: RataMap,
    private readonly repository: RataRepository,
    private readonly rataSummaryService: RataSummaryService,
  ) {}

  async getRataById(id: string): Promise<RataDTO> {
    const result = await this.repository.findOneBy({
      id,
    });

    if (!result) {
      throw new EaseyException(
        new Error(`A RATA record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getRatasByTestSumId(testSumId: string): Promise<RataDTO[]> {
    const results = await this.repository.findBy({
      testSumId,
    });
    return this.map.many(results);
  }

  async getRatasByTestSumIds(testSumIds: string[]): Promise<RataDTO[]> {
    const results = await this.repository.findBy({
      testSumId: In(testSumIds),
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<RataDTO[]> {
    const ratas = await this.getRatasByTestSumIds(testSumIds);

    const rataSummaries = await this.rataSummaryService.export(
      ratas.map(i => i.id),
    );

    ratas.forEach(s => {
      s.rataSummaryData = rataSummaries.filter(i => i.rataId === s.id);
    });

    return ratas;
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { RataRunService } from '../rata-run/rata-run.service';
import { In } from 'typeorm';
import { RataSummaryDTO } from '../dto/rata-summary.dto';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataSummaryRepository } from './rata-summary.repository';

@Injectable()
export class RataSummaryService {
  constructor(
    @InjectRepository(RataSummaryRepository)
    private readonly repository: RataSummaryRepository,
    private readonly map: RataSummaryMap,
    private readonly rataRunService: RataRunService,
  ) {}

  async getRataSummaries(rataId: string): Promise<RataSummaryDTO[]> {
    const records = await this.repository.find({
      rataId: rataId,
    });

    return this.map.many(records);
  }

  async getRataSummary(id: string): Promise<RataSummaryDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new EaseyException(
        new Error(`Rata Summary record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getRataSummariesByRataIds(
    rataIds: string[],
  ): Promise<RataSummaryDTO[]> {
    const results = await this.repository.find({
      where: { rataId: In(rataIds) },
    });
    return this.map.many(results);
  }

  async export(rataIds: string[]): Promise<RataSummaryDTO[]> {
    const rataSummaries = await this.getRataSummariesByRataIds(rataIds);

    const rataRuns = await this.rataRunService.export(
      rataSummaries.map(i => i.id),
    );

    rataSummaries.forEach(s => {
      s.rataRunData = rataRuns.filter(i => i.rataSumId === s.id);
    });

    return rataSummaries;
  }
}

import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { HgSummaryRepository } from './hg-summary.repository';
import { HgInjectionService } from '../hg-injection/hg-injection.service';

@Injectable()
export class HgSummaryService {
  constructor(
    private readonly map: HgSummaryMap,
    @Inject(forwardRef(() => HgInjectionService))
    private readonly hgInjectionService: HgInjectionService,

    @InjectRepository(HgSummaryRepository)
    private readonly repository: HgSummaryRepository,
  ) {}

  async getHgSummaries(testSumId: string): Promise<HgSummaryDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getHgSummary(id: string, testSumId: string): Promise<HgSummaryDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Hg Summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getHgSummaryByTestSumIds(
    testSumIds: string[],
  ): Promise<HgSummaryDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<HgSummaryDTO[]> {
    const hgSummaries = await this.getHgSummaryByTestSumIds(testSumIds);

    const hgInjections = await this.hgInjectionService.export(
      hgSummaries.map(i => i.id),
    );

    hgSummaries.forEach(s => {
      s.HgInjectionData = hgInjections.filter(i => i.hgTestSumId === s.id);
    });

    return hgSummaries;
  }
}

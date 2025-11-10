import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In, DataSource } from 'typeorm';

import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgInjectionService } from '../hg-injection/hg-injection.service';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { HgSummaryRepository } from './hg-summary.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class HgSummaryService {
  constructor(
    @Inject(forwardRef(() => HgInjectionService))
    private readonly hgInjectionService: HgInjectionService,
    private readonly map: HgSummaryMap,
    private readonly repository: HgSummaryRepository,
    private readonly dataSource: DataSource
  ) {}

  async getHgSummaries(testSumId: string): Promise<HgSummaryDTO[]> {
    const records = await useSlaveRepository(this.dataSource, HgSummaryRepository, async (repository) => repository.find({ where: { testSumId } }));

    return this.map.many(records);
  }

  async getHgSummary(id: string, testSumId: string): Promise<HgSummaryDTO> {
    const result = await useSlaveRepository(this.dataSource, HgSummaryRepository, async (repository) => repository.findOneBy({
      id,
      testSumId,
    }));

    if (!result) {
      throw new EaseyException(
        new Error(`Hg Summary record not found with Record Id [${id}].`),
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
      s.hgInjectionData = hgInjections.filter(i => i.hgTestSumId === s.id);
    });

    return hgSummaries;
  }
}

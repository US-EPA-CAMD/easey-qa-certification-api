import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { LinearityInjectionService } from '../linearity-injection/linearity-injection.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryRepository } from './linearity-summary.repository';

@Injectable()
export class LinearitySummaryService {
  constructor(
    private readonly map: LinearitySummaryMap,
    private readonly injectionService: LinearityInjectionService,
    private readonly repository: LinearitySummaryRepository,
  ) {}

  async getSummaryById(id: string): Promise<LinearitySummaryDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `A linearity summary record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getSummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummaryDTO[]> {
    const results = await this.repository.findBy({ testSumId });
    return this.map.many(results);
  }

  async getSummariesByTestSumIds(
    testSumIds: string[],
  ): Promise<LinearitySummaryDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<LinearitySummaryDTO[]> {
    const summaries = await this.getSummariesByTestSumIds(testSumIds);

    const injections = await this.injectionService.export(
      summaries.map(i => i.id),
    );

    summaries.forEach(s => {
      s.linearityInjectionData = injections.filter(i => i.linSumId === s.id);
    });

    return summaries;
  }
}

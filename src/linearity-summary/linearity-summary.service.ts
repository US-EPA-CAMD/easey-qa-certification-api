import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryRepository } from './linearity-summary.repository';
import { LinearityInjectionService } from '../linearity-injection/linearity-injection.service';

@Injectable()
export class LinearitySummaryService {
  constructor(
    private readonly map: LinearitySummaryMap,
    private readonly injectionService: LinearityInjectionService,
    @InjectRepository(LinearitySummaryRepository)
    private readonly repository: LinearitySummaryRepository,
  ) {}

  async getSummaryById(id: string): Promise<LinearitySummaryDTO> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        'Linearity Summary not found.',
        HttpStatus.NOT_FOUND,
        { id },
      );
    }

    return this.map.one(entity);
  }

  async getSummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummaryDTO[]> {
    const results = await this.repository.find({ testSumId });
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

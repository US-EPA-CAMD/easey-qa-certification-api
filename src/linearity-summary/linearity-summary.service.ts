import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryRepository } from './linearity-summary.repository';

@Injectable()
export class LinearitySummaryService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly map: LinearitySummaryMap,
    @InjectRepository(LinearitySummaryRepository)
    private readonly repository: LinearitySummaryRepository,
  ) {}

  async getLinearitySummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummaryDTO[]> {
    const results = await this.repository.find({ testSumId });
    return this.map.many(results);
  }

  async getLinearitySummaryById(
    id: string
  ): Promise<LinearitySummaryDTO> {
    const result = await this.repository.findOne(id);
    return this.map.one(result);
  }
}

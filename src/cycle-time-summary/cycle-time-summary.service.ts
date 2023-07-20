import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { CycleTimeInjectionService } from '../cycle-time-injection/cycle-time-injection.service';
import { In } from 'typeorm';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { CycleTimeSummaryRepository } from './cycle-time-summary.repository';

@Injectable()
export class CycleTimeSummaryService {
  constructor(
    private readonly map: CycleTimeSummaryMap,
    @InjectRepository(CycleTimeSummaryRepository)
    private readonly repository: CycleTimeSummaryRepository,
    @Inject(forwardRef(() => CycleTimeInjectionService))
    private readonly cycleTimeInjectionService: CycleTimeInjectionService,
  ) {}

  async getCycleTimeSummaries(
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getCycleTimeSummary(
    id: string,
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Cycle Time Summary record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getCycleTimeSummaryByTestSumIds(
    testSumIds: string[],
  ): Promise<CycleTimeSummaryDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<CycleTimeSummaryDTO[]> {
    const cycleTimeSummaries = await this.getCycleTimeSummaryByTestSumIds(
      testSumIds,
    );

    const cycleTimeInjections = await this.cycleTimeInjectionService.export(
      cycleTimeSummaries.map(i => i.id),
    );

    cycleTimeSummaries.forEach(s => {
      s.cycleTimeInjectionData = cycleTimeInjections.filter(
        i => i.cycleTimeSumId === s.id,
      );
    });

    return cycleTimeSummaries;
  }
}

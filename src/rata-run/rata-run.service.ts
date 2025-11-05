import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In, DataSource } from 'typeorm';

import { RataRunDTO } from '../dto/rata-run.dto';
import { FlowRataRunService } from '../flow-rata-run/flow-rata-run.service';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunRepository } from './rata-run.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';

@Injectable()
export class RataRunService {
  constructor(
    private readonly repository: RataRunRepository,
    private readonly map: RataRunMap,
    @Inject(forwardRef(() => FlowRataRunService))
    private readonly flowRataRunService: FlowRataRunService,
    private readonly dataSource: DataSource,
  ) {}

  async getRataRuns(rataSumId: string): Promise<RataRunDTO[]> {
    const records = await useSlaveRepository(this.dataSource, RataRunRepository, async (repository) => repository.find({ where: { rataSumId } }));

    return this.map.many(records);
  }

  async getRataRun(id: string): Promise<RataRunDTO> {
    const result = await useSlaveRepository(this.dataSource, RataRunRepository, async (repository) => repository.findOneBy({ id }));

    if (!result) {
      throw new EaseyException(
        new Error(`Rata Run record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getRataRunsByRataSumIds(rataSumIds: string[]): Promise<RataRunDTO[]> {
    const results = await this.repository.find({
      where: { rataSumId: In(rataSumIds) },
    });
    return this.map.many(results);
  }

  async export(rataSumIds: string[]): Promise<RataRunDTO[]> {
    const rataRuns = await this.getRataRunsByRataSumIds(rataSumIds);

    const flowRataRuns = await this.flowRataRunService.export(
      rataRuns.map(i => i.id),
    );

    rataRuns.forEach(s => {
      s.flowRataRunData = flowRataRuns.filter(i => i.rataRunId === s.id);
    });

    return rataRuns;
  }
}

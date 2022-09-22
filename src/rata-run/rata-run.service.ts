import { HttpStatus, Injectable } from '@nestjs/common';
import { RataRunRepository } from './rata-run.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunDTO } from '../dto/rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { FlowRataRunService } from '../flow-rata-run/flow-rata-run.service';

@Injectable()
export class RataRunService {
  constructor(
    @InjectRepository(RataRunRepository)
    private readonly repository: RataRunRepository,
    private readonly map: RataRunMap,
    private readonly flowRataRunService: FlowRataRunService,
  ) {}

  async getRataRuns(rataSumId: string): Promise<RataRunDTO[]> {
    const records = await this.repository.find({ where: { rataSumId } });

    return this.map.many(records);
  }

  async getRataRun(id: string): Promise<RataRunDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Rata Run record not found with Record Id [${id}].`,
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

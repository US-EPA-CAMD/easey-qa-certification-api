import { HttpStatus, Injectable } from '@nestjs/common';
import { FlowRataRunRepository } from './flow-rata-run.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { RataTraverseService } from '../rata-traverse/rata-traverse.service';

@Injectable()
export class FlowRataRunService {
  constructor(
    @InjectRepository(FlowRataRunRepository)
    private readonly repository: FlowRataRunRepository,
    private readonly map: FlowRataRunMap,
    private readonly rataTravarseService: RataTraverseService,
  ) {}

  async getFlowRataRuns(rataRunId: string): Promise<FlowRataRunDTO[]> {
    const records = await this.repository.find({ where: { rataRunId } });

    return this.map.many(records);
  }

  async getFlowRataRun(id: string): Promise<FlowRataRunDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new EaseyException(
        new Error(`Flow Rata Run record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getFlowRataRunsByRataRunIds(
    rataRunIds: string[],
  ): Promise<FlowRataRunDTO[]> {
    const results = await this.repository.find({
      where: { rataRunId: In(rataRunIds) },
    });
    return this.map.many(results);
  }

  async export(rataRunIds: string[]): Promise<FlowRataRunDTO[]> {
    const flowRataRuns = await this.getFlowRataRunsByRataRunIds(rataRunIds);

    const rataTravarses = await this.rataTravarseService.export(
      flowRataRuns.map(i => i.id),
    );

    flowRataRuns.forEach(s => {
      s.rataTraverseData = rataTravarses.filter(i => i.flowRataRunId === s.id);
    });

    return flowRataRuns;
  }
}

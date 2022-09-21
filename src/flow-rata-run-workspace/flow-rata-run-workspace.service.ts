import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { RataTraverseWorkspaceService } from '../rata-traverse-workspace/rata-traverse-workspace.service';

@Injectable()
export class FlowRataRunWorkspaceService {
  constructor(
    @InjectRepository(FlowRataRunWorkspaceRepository)
    private readonly repository: FlowRataRunWorkspaceRepository,
    private readonly map: FlowRataRunMap,
    @Inject(forwardRef(() => RataTraverseWorkspaceService))
    private readonly rataTravarseService: RataTraverseWorkspaceService,
  ) {}

  async getFlowRataRuns(rataRunId: string): Promise<FlowRataRunDTO[]> {
    const records = await this.repository.find({ where: { rataRunId } });

    return this.map.many(records);
  }

  async getFlowRataRun(id: string): Promise<FlowRataRunDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Flow Rata Run record not found with Record Id [${id}].`,
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

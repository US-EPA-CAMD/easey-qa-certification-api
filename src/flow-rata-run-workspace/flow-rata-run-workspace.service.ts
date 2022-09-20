import { HttpStatus, Injectable } from '@nestjs/common';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class FlowRataRunWorkspaceService {
  constructor(
    @InjectRepository(FlowRataRunWorkspaceRepository)
    private readonly repository: FlowRataRunWorkspaceRepository,
    private readonly map: FlowRataRunMap,
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
}

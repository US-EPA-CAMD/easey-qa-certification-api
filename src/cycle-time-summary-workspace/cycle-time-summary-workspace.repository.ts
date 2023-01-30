import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CycleTimeSummary)
export class CycleTimeSummaryWorkspaceRepository extends Repository<
  CycleTimeSummary
> {

    async findOneWithAncestors(id: string): Promise<CycleTimeSummary> {
        return this.findOne({
            relations: ['testSummary'],
            where: {
                id: id
            }
        })
    }
}

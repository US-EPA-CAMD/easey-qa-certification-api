import { AeCorrelationSummaryTest } from 'src/entities/workspace/app-e-correlation-summary.entity'; /* EDIT THE PATH */
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AeCorrelationSummaryTest)
export class FlowToLoadReferenceWorkspaceRepository extends Repository<
  AeCorrelationSummaryTest /* EDIT THIS ENTITY NAME */
> {}

import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { EntityManager, In } from 'typeorm';

import { MatsBulkFileDTO } from '../dto/mats-bulk-file.dto';
import { MatsBulkFileMap } from '../maps/mats-bulk-file.map';
import { MatsBulkFilesReviewAndSubmitRepository } from './mats-bulk-files-review-and-submit.repository';

@Injectable()
export class MatsBulkFilesReviewAndSubmitService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly repository: MatsBulkFilesReviewAndSubmitRepository,
    private readonly map: MatsBulkFileMap,
  ) {}

  returnManager(): any {
    return this.entityManager;
  }

  async getMatsBulkFileRecords(
    orisCodes: number[],
    monPlanIds: string[],
  ): Promise<MatsBulkFileDTO[]> {
    let data: MatsBulkFileDTO[];
    try {
      if (monPlanIds && monPlanIds.length > 0) {
        data = await this.map.many(
          await this.repository.find({
            where: { monPlanIdentifier: In(monPlanIds) },
          }),
        );
      } else {
        data = await this.map.many(
          await this.repository.find({ where: { orisCode: In(orisCodes) } }),
        );
      }

      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

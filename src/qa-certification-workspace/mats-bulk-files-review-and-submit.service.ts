import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { getManager, In } from 'typeorm';
import { MatsBulkFilesReviewAndSubmitRepository } from './mats-bulk-files-review-and-submit.repository';
import { MatsBulkFileMap } from '../maps/mats-bulk-file.map';
import { MatsBulkFileDTO } from '../dto/mats-bulk-file.dto';

const moment = require('moment');

@Injectable()
export class MatsBulkFilesReviewAndSubmitService {
  constructor(
    @InjectRepository(MatsBulkFilesReviewAndSubmitRepository)
    private readonly repository: MatsBulkFilesReviewAndSubmitRepository,
    private readonly map: MatsBulkFileMap,
  ) {}

  returnManager(): any {
    return getManager();
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

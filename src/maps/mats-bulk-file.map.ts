import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MatsBulkFile } from '../entities/mats-bulk-file.entity';
import { MatsBulkFileDTO } from '../dto/mats-bulk-file.dto';

@Injectable()
export class MatsBulkFileMap extends BaseMap<MatsBulkFile, MatsBulkFileDTO> {
  public async one(entity: MatsBulkFile): Promise<MatsBulkFileDTO> {
    return {
      matsBulkFileIdentifier: entity.matsBulkFileIdentifier,
      facIdentifier: entity.facIdentifier,
      orisCode: entity.orisCode,
      location: entity.location,
      testTypeCode: entity.testTypeCode,
      testTypeCodeDescription: entity.testTypeCodeDescription,
      facilityName: entity.facilityName,
      monPlanIdentifier: entity.monPlanIdentifier,
      testNumber: entity.testNumber,
      filename: entity.filename,
      lastUpdated: entity.lastUpdated,
      updatedStatusFLG: entity.updatedStatusFLG,
      submissionIdentifier: entity.submissionIdentifier,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      userid: entity.userid,
      addDate: entity.addDate,
      bucketLocation: entity.bucketLocation,
      evalStatusCode: entity.evalStatusCode,
    };
  }
}

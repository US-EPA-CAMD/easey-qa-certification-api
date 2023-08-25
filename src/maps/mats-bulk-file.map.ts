import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MatsBulkFile } from '../entities/mats-bulk-file.entity';
import { MatsBulkFileDTO } from '../dto/mats-bulk-file.dto';

@Injectable()
export class MatsBulkFileMap extends BaseMap<MatsBulkFile, MatsBulkFileDTO> {
  public async one(entity: MatsBulkFile): Promise<MatsBulkFileDTO> {
    return {
      orisCode: entity.orisCode,
      facilityName: entity.facilityName,
      monPlanId: entity.monPlanIdentifier,
      locationInfo: entity.locationInfo,
      matsBulkFileIdentifier: entity.matsBulkFileIdentifier,
      monLOCIdentifier: entity.monLOCIdentifier,
      systemComponentIdentifier: entity.systemComponentIdentifier,
      userid: entity.userid,
      updateDate: entity.updateDate,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      submissionAvailabilityCodeDescription:
        entity.submissionAvailabilityCodeDescription,
      testNumber: entity.testNumber,
      filename: entity.filename,
      updatedStatusFLG: entity.updatedStatusFLG,
    };
  }
}

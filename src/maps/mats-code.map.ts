import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { MatsCodeDTO } from '../dto/mats-code.dto';
import { MatsAveragingGroupCode } from '../entities/mats-averaging-group-code.entity';
import { MatsPollutantCode } from '../entities/mats-pollutant-code.entity';
import { MatsReportTypeCode } from '../entities/mats-report-type-code.entity';
import { MatsStatusCode } from '../entities/mats-status-code.entity';
import { MatsTestMethodCode } from '../entities/mats-test-method-code.entity';

@Injectable()
export class MatsCodeMap extends BaseMap<
  | MatsAveragingGroupCode
  | MatsPollutantCode
  | MatsReportTypeCode
  | MatsStatusCode
  | MatsTestMethodCode,
  MatsCodeDTO
> {
  public async one(
    entity:
      | MatsAveragingGroupCode
      | MatsPollutantCode
      | MatsReportTypeCode
      | MatsStatusCode
      | MatsTestMethodCode,
  ): Promise<MatsCodeDTO> {
    return {
      code: entity.code,
      description: entity.description,
    };
  }
}

import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationRepository } from './online-offline-calibration.repository';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class OnlineOfflineCalibrationService {
  constructor(
    private readonly logger: Logger,
    private readonly map: OnlineOfflineCalibrationMap,
    @InjectRepository(OnlineOfflineCalibrationRepository)
    private readonly repository: OnlineOfflineCalibrationRepository,
    @Inject(forwardRef(() => TestSummaryService))
    private readonly testSummaryService: TestSummaryService,
  ) {}

  async getOnlineOfflineCalibrations(
    testSumId: string,
  ): Promise<OnlineOfflineCalibrationDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async getOnlineOfflineCalibration(
    id: string,
  ): Promise<OnlineOfflineCalibrationDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Online Offline Calibration record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}

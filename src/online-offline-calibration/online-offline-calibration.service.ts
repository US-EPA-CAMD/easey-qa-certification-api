import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { In } from 'typeorm';

import {
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { OnlineOfflineCalibrationRepository } from './online-offline-calibration.repository';

@Injectable()
export class OnlineOfflineCalibrationService {
  constructor(
    private readonly logger: Logger,
    private readonly map: OnlineOfflineCalibrationMap,
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
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Online Offline Calibration record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async onlineOfflineCalibrationByTestSumIds(
    testSumIds: string[],
  ): Promise<OnlineOfflineCalibrationDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(
    testSumIds: string[],
  ): Promise<OnlineOfflineCalibrationRecordDTO[]> {
    return this.onlineOfflineCalibrationByTestSumIds(testSumIds);
  }
}

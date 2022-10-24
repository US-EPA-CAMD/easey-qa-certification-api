import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '../utilities/functions';
import {
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibration } from '../entities/workspace/online-offline-calibration.entity';
import { OnlineOfflineCalibrationWorkspaceRepository } from './online-offline-calibration.repository';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class OnlineOfflineCalibrationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: OnlineOfflineCalibrationMap,
    @InjectRepository(OnlineOfflineCalibrationWorkspaceRepository)
    private readonly repository: OnlineOfflineCalibrationWorkspaceRepository,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async createOnlineOfflineCalibration(
    testSumId: string,
    payload: OnlineOfflineCalibrationBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<OnlineOfflineCalibrationRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);
    entity = await this.repository.findOne(entity.id);
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    const dto = await this.map.one(entity);
    return dto;
  }
}

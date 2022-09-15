import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class AirEmissionTestingWorkspaceService {
  constructor(
    private readonly map: AirEmissionTestingMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AirEmissionTestingWorkspaceRepository)
    private readonly repository: AirEmissionTestingWorkspaceRepository,
  ) {}

  async getAirEmissionTesting(
    id: string,
  ): Promise<AirEmissionTestingRecordDTO> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `A air emission testing record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(entity);
  }

  async createAirEmissionTesting(
    testSumId: string,
    payload: AirEmissionTestingBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AirEmissionTestingRecordDTO> {
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
    return this.map.one(entity);
  }

  async updateAirEmissionTesting(
    testSumId: string,
    id: string,
    payload: AirEmissionTestingBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AirEmissionTestingRecordDTO> {
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.getAirEmissionTesting(id);

    entity.qiLastName = payload.qiLastName;
    entity.qiFirstName = payload.qiFirstName;
    entity.qiMiddleInitial = payload.qiMiddleInitial;
    entity.aetbName = payload.aetbName;
    entity.aetbPhoneNumber = payload.aetbPhoneNumber;
    entity.aetbEmail = payload.aetbEmail;
    entity.examDate = payload.examDate;
    entity.providerName = payload.providerName;
    entity.providerEmail = payload.providerEmail;

    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getAirEmissionTesting(id);
  }
}

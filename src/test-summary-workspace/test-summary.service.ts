import { v4 as uuid } from 'uuid';
import { getManager } from 'typeorm';

import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestSummaryDTO,
  TestSummaryBaseDTO,
  TestSummaryRecordDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';

import { currentDateTime } from '../utilities/functions';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { LinearitySummaryWorkspaceService } from '../linearity-summary-workspace/linearity-summary.service';
import { Component } from './../entities/workspace/component.entity';
import { MonitorSystem } from './../entities/workspace/monitor-system.entity';
import { ReportingPeriod } from './../entities/workspace/reporting-period.entity';

@Injectable()
export class TestSummaryWorkspaceService {

  constructor(
    private readonly logger: Logger,
    private readonly map: TestSummaryMap,
    @Inject(forwardRef(() => LinearitySummaryWorkspaceService))
    private readonly linearityService: LinearitySummaryWorkspaceService,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly repository: TestSummaryWorkspaceRepository,
  ) {}

  async getTestSummaryById(
    testSumId: string,
  ): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(
      testSumId,
    );
    return this.map.one(result);
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode: string,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      testTypeCode,
    );

    return this.map.many(results);
  }

  async getTestSummaries(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testTypeCode?: string,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
      testTypeCode,
    )

    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
  ): Promise<TestSummaryDTO[]> {
    const promises = [];

    const summaries = await this.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
    );

    promises.push(
      new Promise(async (resolve, _reject) => {
        const testSumIds = summaries
          .filter(i => i.testTypeCode === 'LINE')
          .map(i => i.id );
        const linearities = this.linearityService.export(testSumIds);
        resolve(linearities);
      }),
    );

    await Promise.all(promises);
    return summaries;
  }

  async import(payload: TestSummaryImportDTO) {
    const isImport = true;
  }

  async createTestSummary(
    locationId: string,
    payload: TestSummaryBaseDTO,
    userId: string,    
  ): Promise<TestSummaryRecordDTO> {
    const timestamp = currentDateTime();
    const [reportPeriodId, componentRecordId, monitorSystemRecordId] = await this.lookupValues(locationId, payload);
    
    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      locationId,
      monitorSystemRecordId,
      componentRecordId,
      reportPeriodId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
      lastUpdated: timestamp,
      needsEvalFlag: 'Y',
      updatedStatusFlag: 'Y',    
      evalStatusCode: 'EVAL',
    });

    await this.repository.save(entity);
    entity = await this.repository.getTestSummaryById(entity.id);
    const dto = await this.map.one(entity);
    delete dto.linearitySummaryData;
    return dto;
  }

  async updateTestSummary(
    locationId: string,
    id: string,
    payload: TestSummaryBaseDTO,
    userId: string,
  ): Promise<TestSummaryRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOne(id);
    const [reportPeriodId, componentRecordId, monitorSystemRecordId] = await this.lookupValues(locationId, payload);

    entity.beginDate = payload.beginDate;
    entity.beginHour = payload.beginHour;
    entity.beginMinute = payload.beginMinute;
    entity.endDate = payload.endDate;
    entity.endHour = payload.endHour;
    entity.endMinute = payload.endMinute;
    entity.componentRecordId = componentRecordId;
    entity.gracePeriodIndicator = payload.gracePeriodIndicator;
    entity.injectionProtocolCode = payload.injectionProtocolCode;
    entity.monitorSystemRecordId = monitorSystemRecordId;
    entity.reportPeriodId = reportPeriodId;
    entity.spanScaleCode = payload.spanScaleCode;
    entity.testComment = payload.testComment;
    entity.testDescription = payload.testDescription;
    entity.testNumber = payload.testNumber;
    entity.testReasonCode = payload.testReasonCode;
    entity.testResultCode = payload.testResultCode;
    entity.testTypeCode = payload.testTypeCode;
    entity.userId = userId;
    entity.lastUpdated = timestamp;
    entity.updateDate = timestamp;
    entity.needsEvalFlag = 'Y';
    entity.updatedStatusFlag = 'Y';
    entity.evalStatusCode = 'EVAL';

    await this.repository.save(entity);
    return this.map.one(entity);
  }

  async deleteTestSummary(
    id: string,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    }
    catch(e) {
      throw new InternalServerErrorException(`Error deleting Test Summary record Id [${id}]`, e.message);
    }
  }

  async resetToNeedsEvaluation(
    testSumId: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    if (!isImport) {
      const timestamp = currentDateTime();
      const entity = await this.repository.findOne(testSumId);

      entity.userId = userId;
      entity.updateDate = timestamp;
      entity.lastUpdated = timestamp;
      entity.needsEvalFlag = 'Y';
      entity.updatedStatusFlag = 'Y';    
      entity.evalStatusCode = 'EVAL';

      await this.repository.save(entity);
    }
  }

  private async lookupValues(
    locationId: string,
    payload: TestSummaryBaseDTO,
  ) {
    const mgr = getManager();

    let reportPeriodId = null;
    let componentRecordId = null;
    let monitorSystemRecordId = null;

    if (payload.year && payload.quarter) {
      const rptPeriod = await mgr.findOne(ReportingPeriod, {
        where: {
          year: payload.year,
          quarter: payload.quarter,
        }
      });

      reportPeriodId = rptPeriod ? rptPeriod.id : null;
    }

    if (payload.componentId) {
      const component = await mgr.findOne(Component, {
        where: {
          locationId: locationId,
          componentId: payload.componentId,
        }
      });

      componentRecordId = component ? component.id : null;
    }

    if (payload.monitoringSystemId) {
      const monitorSystem = await mgr.findOne(MonitorSystem, {
        where: {
          locationId,
          monitoringSystemId: payload.monitoringSystemId,
        }
      });

      monitorSystemRecordId = monitorSystem ? monitorSystem.id : null;
    }    

    return [
      reportPeriodId,
      componentRecordId,
      monitorSystemRecordId,
    ];
  }
}

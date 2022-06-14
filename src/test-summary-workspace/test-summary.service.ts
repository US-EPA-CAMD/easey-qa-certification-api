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
import { TestTypeCodes } from './../enums/test-type-code.enum';
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

  async import() {
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

  async importChecks(summaries: TestSummaryImportDTO[]) {
    this.logger.info('Running Test Summary related import checks');

    let errorList = [];

    summaries.forEach(summary => {
      const invalidChildRecords = [];

      if (summary.testTypeCode !== TestTypeCodes.RATA) {
        if (summary.rataData && summary.rataData.length > 0) {
          invalidChildRecords.push('RATA');
        }
        if (summary.testQualificationData && summary.testQualificationData.length > 0) {
         invalidChildRecords.push('Test Qualification');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.SEVENDAY) {
        if (summary.calibrationInjectionData && summary.calibrationInjectionData.length > 0) {
          invalidChildRecords.push('Calibration Injection');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.LINE) {
        if (summary.linearitySummaryData && summary.linearitySummaryData.length > 0) {
          invalidChildRecords.push('Linearity Summary');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.HGLINE && summary.testTypeCode !== TestTypeCodes.HGSI3) {
        if (summary.hgSummaryData && summary.hgSummaryData.length > 0) {
          invalidChildRecords.push('Hg Linearity or System Integrity Summary');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.F2LREF) {
        if (summary.flowToLoadReferenceData && summary.flowToLoadReferenceData.length > 0) {
          invalidChildRecords.push('Flow to Load Reference');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.F2LCHK) {
        if (summary.flowToLoadCheckData && summary.flowToLoadCheckData.length > 0) {
          invalidChildRecords.push('Flow to Load Check');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.CYCLE) {
        if (summary.cycleTimeSummaryData && summary.cycleTimeSummaryData.length > 0) {
          invalidChildRecords.push('Cycle Time Summary');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.ONOFF) {
        if (summary.onlineOfflineCalibrationData && summary.onlineOfflineCalibrationData.length > 0) {
          invalidChildRecords.push('Online Offline Calibration');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.FFACC) {
        if (summary.fuelFlowmeterAccuracyData && summary.fuelFlowmeterAccuracyData.length > 0) {
          invalidChildRecords.push('Fuel Flowmeter Accuracy');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.FFACCTT) {
        if (summary.transmitterTransducerData && summary.transmitterTransducerData.length > 0) {
          invalidChildRecords.push('Transmitter Transducer');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.FF2LBAS) {
        if (summary.fuelFlowToLoadBaselineData && summary.fuelFlowToLoadBaselineData.length > 0) {
          invalidChildRecords.push('Fuel Flow to Load Baseline');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.FF2LTST) {
        if (summary.fuelFlowToLoadTestData && summary.fuelFlowToLoadTestData.length > 0) {
          invalidChildRecords.push('Fuel Flow to Load Test');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.APPE) {
        if (summary.appECorrelationTestSummaryData && summary.appECorrelationTestSummaryData.length > 0) {
          invalidChildRecords.push('Appendix E Correlation Test Summary');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.UNITDEF) {
        if (summary.unitDefaultTestData && summary.unitDefaultTestData.length > 0) {
          invalidChildRecords.push('Unit Default Test');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.RATA &&
          summary.testTypeCode !== TestTypeCodes.LINE &&
          summary.testTypeCode !== TestTypeCodes.APPE &&
          summary.testTypeCode !== TestTypeCodes.UNITDEF
      ) {
        if (summary.protocolGasData && summary.protocolGasData.length > 0) {
          invalidChildRecords.push('Protocol Gas');
        }
      }

      if (summary.testTypeCode !== TestTypeCodes.RATA &&
        summary.testTypeCode !== TestTypeCodes.APPE &&
        summary.testTypeCode !== TestTypeCodes.UNITDEF
      ) {
        if (summary.airEmissionTestData && summary.airEmissionTestData.length > 0) {
          invalidChildRecords.push('Air Emission Test');
        }
      }

      if (invalidChildRecords.length > 0) {
        errorList.push(
          `[IMPORT-16] You have reported [${invalidChildRecords}] records for Test Summary record [${summary.testNumber}] with a Test Type Code of [${summary.testTypeCode}].`
        );
      }
    });

    return errorList;
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

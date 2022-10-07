import { v4 as uuid } from 'uuid';
import { getManager } from 'typeorm';

import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

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

import { Unit } from './../entities/workspace/unit.entity';
import { Component } from './../entities/workspace/component.entity';
import { StackPipe } from './../entities/workspace/stack-pipe.entity';
import { MonitorSystem } from './../entities/workspace/monitor-system.entity';
import { MonitorLocation } from './../entities/workspace/monitor-location.entity';
import { ReportingPeriod } from './../entities/workspace/reporting-period.entity';
import { RataWorkspaceService } from '../rata-workspace/rata-workspace.service';

import { TestTypeCodes } from '../enums/test-type-code.enum';
import { ProtocolGasWorkspaceService } from '../protocol-gas-workspace/protocol-gas.service';
import { AppECorrelationTestSummaryWorkspaceService } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.service';

@Injectable()
export class TestSummaryWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: TestSummaryMap,
    @Inject(forwardRef(() => LinearitySummaryWorkspaceService))
    private readonly linearityService: LinearitySummaryWorkspaceService,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly repository: TestSummaryWorkspaceRepository,
    @Inject(forwardRef(() => RataWorkspaceService))
    private readonly rataService: RataWorkspaceService,
    @Inject(forwardRef(() => ProtocolGasWorkspaceService))
    private readonly protocolGasService: ProtocolGasWorkspaceService,
    @Inject(forwardRef(() => AppECorrelationTestSummaryWorkspaceService))
    private readonly appECorrelationTestSummaryWorkspaceService: AppECorrelationTestSummaryWorkspaceService,
  ) {}

  async getTestSummaryById(testSumId: string): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(testSumId);

    if (!result) {
      throw new LoggingException(
        `A test summary record not found with Record Id [${testSumId}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    const dto = await this.map.one(result);

    delete dto.calibrationInjectionData;
    delete dto.linearitySummaryData;
    delete dto.rataData;
    delete dto.flowToLoadReferenceData;
    delete dto.flowToLoadCheckData;
    delete dto.cycleTimeSummaryData;
    delete dto.onlineOfflineCalibrationData;
    delete dto.fuelFlowmeterAccuracyData;
    delete dto.transmitterTransducerData;
    delete dto.fuelFlowToLoadBaselineData;
    delete dto.fuelFlowToLoadTestData;
    delete dto.appECorrelationTestSummaryData;
    delete dto.unitDefaultTestData;
    delete dto.hgSummaryData;
    delete dto.testQualificationData;
    delete dto.protocolGasData;
    delete dto.airEmissionTestingData;
    delete dto.appECorrelationTestSummaryData

    return dto;
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      testTypeCode,
      beginDate,
      endDate,
    );

    return this.map.many(results);
  }

  async getTestSummaries(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testSummaryIds?: string[],
    testTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testSummaryIds?: string[],
    testTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const promises = [];

    const testSummaries = await this.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    promises.push(
      new Promise(async (resolve, _reject) => {
        let linearitySummaryData,
          rataData,
          protocolGasData,
          appECorrelationTestSummaryData = null;
        let testSumIds;
        if (testTypeCodes?.length > 0) {
          testSumIds = testSummaries.filter(i =>
            testTypeCodes.includes(i.testTypeCode),
          );
        }
        testSumIds = testSummaries.map(i => i.id);

        if (testSumIds) {
          linearitySummaryData = await this.linearityService.export(testSumIds);
          rataData = await this.rataService.export(testSumIds);
          protocolGasData = await this.protocolGasService.export(testSumIds);
          appECorrelationTestSummaryData = await this.appECorrelationTestSummaryWorkspaceService.export(testSumIds)
          testSummaries.forEach(s => {
            s.linearitySummaryData = linearitySummaryData.filter(
              i => i.testSumId === s.id,
            );
            s.rataData = rataData.filter(i => i.testSumId === s.id);
            s.protocolGasData = protocolGasData.filter(
              i => i.testSumId === s.id,
            );
            s.appECorrelationTestSummaryData = appECorrelationTestSummaryData.filter(
              i => i.testSumId === s.id,
            );
          });
        }

        resolve(testSummaries);
      }),
    );

    await Promise.all(promises);
    return testSummaries;
  }

  async import(
    locationId: string,
    payload: TestSummaryImportDTO,
    userId: string,
    historicalrecordId?: string,
  ) {
    const promises = [];

    const summary = await this.repository.getTestSummaryByLocationId(
      locationId,
      payload.testTypeCode,
      payload.testNumber,
    );

    if (summary) {
      await this.deleteTestSummary(summary.id);
    }

    const createdTestSummary = await this.createTestSummary(
      locationId,
      payload,
      userId,
      historicalrecordId,
    );

    this.logger.info(
      `Test Summary Successfully Imported. Record Id: ${createdTestSummary.id}`,
    );

    if (
      payload.linearitySummaryData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.LINE
    ) {
      for (const linearitySummary of payload.linearitySummaryData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.linearityService.import(
                createdTestSummary.id,
                linearitySummary,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.rataData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.RATA
    ) {
      for (const rata of payload.rataData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.rataService.import(
                createdTestSummary.id,
                rata,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (payload.protocolGasData?.length > 0) {
      for (const protocolGas of payload.protocolGasData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.protocolGasService.import(
                createdTestSummary.id,
                protocolGas,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    if (
      payload.appECorrelationTestSummaryData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.RATA
    ) {
      for (const appECorrelationTestSummary of payload.appECorrelationTestSummaryData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.appECorrelationTestSummaryWorkspaceService.import(
                createdTestSummary.id,
                appECorrelationTestSummary,
                userId,
                historicalrecordId !== null ? true : false,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async createTestSummary(
    locationId: string,
    payload: TestSummaryBaseDTO,
    userId: string,
    historicalrecordId?: string,
  ): Promise<TestSummaryRecordDTO> {
    const mgr = getManager();
    const timestamp = currentDateTime();
    const [
      reportPeriodId,
      componentRecordId,
      monitorSystemRecordId,
    ] = await this.lookupValues(locationId, payload);
    const location = await mgr.findOne(MonitorLocation, locationId);

    let unit: Unit;
    let stackPipe: StackPipe;

    if (location.unitId) {
      unit = await mgr.findOne(Unit, location.unitId);
    } else {
      stackPipe = await mgr.findOne(StackPipe, location.stackPipeId);
    }

    if (
      (unit && payload.unitId !== unit.name) ||
      (stackPipe && payload.stackPipeId !== stackPipe.name)
    ) {
      throw new LoggingException(
        `The provided Location Id [${locationId}] does not match the provided Unit/Stack [${
          payload.unitId ? payload.unitId : payload.stackPipeId
        }]`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const entity = this.repository.create({
      ...payload,
      id: historicalrecordId ? historicalrecordId : uuid(),
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
    const result = await this.repository.getTestSummaryById(entity.id);

    const dto = await this.map.one(result);

    delete dto.calibrationInjectionData;
    delete dto.linearitySummaryData;
    delete dto.rataData;
    delete dto.flowToLoadReferenceData;
    delete dto.flowToLoadCheckData;
    delete dto.cycleTimeSummaryData;
    delete dto.onlineOfflineCalibrationData;
    delete dto.fuelFlowmeterAccuracyData;
    delete dto.transmitterTransducerData;
    delete dto.fuelFlowToLoadBaselineData;
    delete dto.fuelFlowToLoadTestData;
    delete dto.appECorrelationTestSummaryData;
    delete dto.unitDefaultTestData;
    delete dto.hgSummaryData;
    delete dto.testQualificationData;
    delete dto.protocolGasData;
    delete dto.airEmissionTestingData;

    return dto;
  }

  async updateTestSummary(
    locationId: string,
    id: string,
    payload: TestSummaryBaseDTO,
    userId: string,
  ): Promise<TestSummaryRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.getTestSummaryById(id);

    if (!entity) {
      throw new LoggingException(
        `A test summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [
      reportPeriodId,
      componentRecordId,
      monitorSystemRecordId,
    ] = await this.lookupValues(locationId, payload);

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

  async deleteTestSummary(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException(
        `Error deleting Test Summary record Id [${id}]`,
        e.message,
      );
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

  async lookupValues(locationId: string, payload: TestSummaryBaseDTO) {
    const mgr = getManager();

    let reportPeriodId = null;
    let componentRecordId = null;
    let monitorSystemRecordId = null;

    if (payload.year && payload.quarter) {
      const rptPeriod = await mgr.findOne(ReportingPeriod, {
        where: {
          year: payload.year,
          quarter: payload.quarter,
        },
      });

      reportPeriodId = rptPeriod ? rptPeriod.id : null;
    }

    if (payload.componentID) {
      const component = await mgr.findOne(Component, {
        where: {
          locationId: locationId,
          componentID: payload.componentID,
        },
      });

      componentRecordId = component ? component.id : null;
    }

    if (payload.monitoringSystemID) {
      const monitorSystem = await mgr.findOne(MonitorSystem, {
        where: {
          locationId,
          monitoringSystemID: payload.monitoringSystemID,
        },
      });

      monitorSystemRecordId = monitorSystem ? monitorSystem.id : null;
    }

    return [reportPeriodId, componentRecordId, monitorSystemRecordId];
  }
}

import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { v4 as uuid } from 'uuid';

import { AirEmissionTestingWorkspaceService } from '../air-emission-testing-workspace/air-emission-testing-workspace.service';
import { AppECorrelationTestSummaryWorkspaceService } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.service';
import { CalibrationInjectionWorkspaceService } from '../calibration-injection-workspace/calibration-injection-workspace.service';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { CycleTimeSummaryWorkspaceService } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.service';
import {
  TestSummaryBaseDTO,
  TestSummaryDTO,
  TestSummaryImportDTO,
  TestSummaryRecordDTO,
} from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { FlowToLoadCheckWorkspaceService } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.service';
import { FlowToLoadReferenceWorkspaceService } from '../flow-to-load-reference-workspace/flow-to-load-reference-workspace.service';
import { FuelFlowToLoadBaselineWorkspaceService } from '../fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.service';
import { FuelFlowToLoadTestWorkspaceService } from '../fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.service';
import { FuelFlowmeterAccuracyWorkspaceService } from '../fuel-flowmeter-accuracy-workspace/fuel-flowmeter-accuracy-workspace.service';
import { HgSummaryWorkspaceService } from '../hg-summary-workspace/hg-summary-workspace.service';
import { LinearitySummaryWorkspaceService } from '../linearity-summary-workspace/linearity-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { OnlineOfflineCalibrationWorkspaceService } from '../online-offline-calibration-workspace/online-offline-calibration.service';
import { ProtocolGasWorkspaceService } from '../protocol-gas-workspace/protocol-gas.service';
import { QASuppDataWorkspaceService } from '../qa-supp-data-workspace/qa-supp-data.service';
import { RataWorkspaceService } from '../rata-workspace/rata-workspace.service';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { TestQualificationWorkspaceService } from '../test-qualification-workspace/test-qualification-workspace.service';
import { TransmitterTransducerAccuracyWorkspaceService } from '../transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.service';
import { UnitDefaultTestWorkspaceService } from '../unit-default-test-workspace/unit-default-test-workspace.service';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';

@Injectable()
export class TestSummaryWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: TestSummaryMap,
    @Inject(forwardRef(() => LinearitySummaryWorkspaceService))
    private readonly linearityService: LinearitySummaryWorkspaceService,
    private readonly repository: TestSummaryWorkspaceRepository,
    @Inject(forwardRef(() => RataWorkspaceService))
    private readonly rataService: RataWorkspaceService,
    @Inject(forwardRef(() => ProtocolGasWorkspaceService))
    private readonly protocolGasService: ProtocolGasWorkspaceService,
    @Inject(forwardRef(() => FuelFlowToLoadTestWorkspaceService))
    private readonly fuelFlowToLoadTestWorkspaceService: FuelFlowToLoadTestWorkspaceService,
    @Inject(forwardRef(() => AppECorrelationTestSummaryWorkspaceService))
    private readonly appECorrelationTestSummaryWorkspaceService: AppECorrelationTestSummaryWorkspaceService,
    @Inject(forwardRef(() => CalibrationInjectionWorkspaceService))
    private readonly calInjWorkspaceService: CalibrationInjectionWorkspaceService,
    private readonly monitorLocationRepository: MonitorLocationRepository,
    private readonly componentRepository: ComponentWorkspaceRepository,
    private readonly monSysWorkspaceRepository: MonitorSystemWorkspaceRepository,
    private readonly reportingPeriodRepository: ReportingPeriodRepository,
    @Inject(forwardRef(() => FuelFlowToLoadBaselineWorkspaceService))
    private readonly fuelFlowToLoadBaselineWorkspaceService: FuelFlowToLoadBaselineWorkspaceService,
    @Inject(forwardRef(() => FlowToLoadCheckWorkspaceService))
    private readonly flowToLoadCheckWorkspaceService: FlowToLoadCheckWorkspaceService,
    @Inject(forwardRef(() => FuelFlowmeterAccuracyWorkspaceService))
    private readonly fuelFlowmeterAccuracyWorkspaceService: FuelFlowmeterAccuracyWorkspaceService,
    @Inject(forwardRef(() => FlowToLoadReferenceWorkspaceService))
    private readonly flowToLoadReferenceWorkspaceService: FlowToLoadReferenceWorkspaceService,
    @Inject(forwardRef(() => OnlineOfflineCalibrationWorkspaceService))
    private readonly onlineOfflineCalibrationWorkspaceService: OnlineOfflineCalibrationWorkspaceService,
    @Inject(forwardRef(() => CycleTimeSummaryWorkspaceService))
    private readonly cycleTimeSummaryWorkspaceService: CycleTimeSummaryWorkspaceService,
    @Inject(forwardRef(() => TransmitterTransducerAccuracyWorkspaceService))
    private readonly transmitterTransducerAccuracyWorkspaceService: TransmitterTransducerAccuracyWorkspaceService,
    @Inject(forwardRef(() => UnitDefaultTestWorkspaceService))
    private readonly unitDefaultTestWorkspaceService: UnitDefaultTestWorkspaceService,
    @Inject(forwardRef(() => HgSummaryWorkspaceService))
    private readonly hgSummaryWorkspaceService: HgSummaryWorkspaceService,
    @Inject(forwardRef(() => AirEmissionTestingWorkspaceService))
    private readonly airEmissionTestingWorkspaceService: AirEmissionTestingWorkspaceService,
    @Inject(forwardRef(() => TestQualificationWorkspaceService))
    private readonly testQualificationWorkspaceService: TestQualificationWorkspaceService,
    @Inject(forwardRef(() => QASuppDataWorkspaceService))
    private readonly qaSuppDataService: QASuppDataWorkspaceService,
  ) {}

  async getTestSummaryById(testSumId: string): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(testSumId);

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
    delete dto.unitDefaultTestData;
    delete dto.hgSummaryData;
    delete dto.testQualificationData;
    delete dto.protocolGasData;
    delete dto.airEmissionTestingData;
    delete dto.appendixECorrelationTestSummaryData;

    return dto;
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string[],
    systemTypeCode?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      testTypeCode,
      systemTypeCode,
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

  private async getAllChildrenData(testTypeCodes, testSummaries) {
    let linearitySummaryData,
      rataData,
      protocolGasData,
      fuelFlowToLoadTestData,
      fuelFlowToLoadBaselineData,
      fuelFlowmeterAccuracyData,
      calibrationInjectionData,
      cycleTimeSummaryData,
      flowToLoadCheckData,
      flowToLoadReferenceData,
      appECorrelationTestSummaryData,
      onlineOfflineCalibrationData,
      unitDefaultTestData,
      transmitterTransducerAccuracyData,
      hgSummaryData,
      testQualificationData,
      airEmissionTestingData;

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

      appECorrelationTestSummaryData = await this.appECorrelationTestSummaryWorkspaceService.export(
        testSumIds,
      );

      fuelFlowToLoadTestData = await this.fuelFlowToLoadTestWorkspaceService.export(
        testSumIds,
      );

      fuelFlowToLoadBaselineData = await this.fuelFlowToLoadBaselineWorkspaceService.export(
        testSumIds,
      );

      fuelFlowmeterAccuracyData = await this.fuelFlowmeterAccuracyWorkspaceService.export(
        testSumIds,
      );

      calibrationInjectionData = await this.calInjWorkspaceService.export(
        testSumIds,
      );

      flowToLoadCheckData = await this.flowToLoadCheckWorkspaceService.export(
        testSumIds,
      );

      flowToLoadReferenceData = await this.flowToLoadReferenceWorkspaceService.export(
        testSumIds,
      );

      onlineOfflineCalibrationData = await this.onlineOfflineCalibrationWorkspaceService.export(
        testSumIds,
      );

      cycleTimeSummaryData = await this.cycleTimeSummaryWorkspaceService.export(
        testSumIds,
      );

      unitDefaultTestData = await this.unitDefaultTestWorkspaceService.export(
        testSumIds,
      );

      transmitterTransducerAccuracyData = await this.transmitterTransducerAccuracyWorkspaceService.export(
        testSumIds,
      );

      testQualificationData = await this.testQualificationWorkspaceService.export(
        testSumIds,
      );

      airEmissionTestingData = await this.airEmissionTestingWorkspaceService.export(
        testSumIds,
      );

      hgSummaryData = await this.hgSummaryWorkspaceService.export(testSumIds);

      testSummaries.forEach(s => {
        s.linearitySummaryData = linearitySummaryData.filter(
          i => i.testSumId === s.id,
        );
        s.rataData = rataData.filter(i => i.testSumId === s.id);
        s.protocolGasData = protocolGasData.filter(i => i.testSumId === s.id);
        s.appendixECorrelationTestSummaryData = appECorrelationTestSummaryData.filter(
          i => i.testSumId === s.id,
        );
        s.fuelFlowToLoadTestData = fuelFlowToLoadTestData.filter(
          i => i.testSumId === s.id,
        );
        s.fuelFlowToLoadBaselineData = fuelFlowToLoadBaselineData.filter(
          i => i.testSumId === s.id,
        );
        s.calibrationInjectionData = calibrationInjectionData.filter(
          i => i.testSumId === s.id,
        );
        s.flowToLoadCheckData = flowToLoadCheckData.filter(
          i => i.testSumId === s.id,
        );
        s.flowToLoadReferenceData = flowToLoadReferenceData.filter(
          i => i.testSumId === s.id,
        );
        s.fuelFlowmeterAccuracyData = fuelFlowmeterAccuracyData.filter(
          i => i.testSumId === s.id,
        );
        s.onlineOfflineCalibrationData = onlineOfflineCalibrationData.filter(
          i => i.testSumId === s.id,
        );
        s.cycleTimeSummaryData = cycleTimeSummaryData.filter(
          i => i.testSumId === s.id,
        );
        s.unitDefaultTestData = unitDefaultTestData.filter(
          i => i.testSumId === s.id,
        );
        s.transmitterTransducerData = transmitterTransducerAccuracyData.filter(
          i => i.testSumId === s.id,
        );
        s.testQualificationData = testQualificationData.filter(
          i => i.testSumId === s.id,
        );
        s.airEmissionTestingData = airEmissionTestingData.filter(
          i => i.testSumId === s.id,
        );
        s.hgSummaryData = hgSummaryData.filter(i => i.testSumId === s.id);
      });
    }

    return testSummaries;
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
    const testSummaries = await this.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    return this.getAllChildrenData(testTypeCodes, testSummaries);
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

    this.logger.log(
      `Test Summary Successfully Imported. Record Id: ${createdTestSummary.id}`,
    );

    if (
      payload.linearitySummaryData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.LINE
    ) {
      for (const linearitySummary of payload.linearitySummaryData) {
        promises.push(
          this.linearityService.import(
            createdTestSummary.id,
            linearitySummary,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.rataData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.RATA
    ) {
      for (const rata of payload.rataData) {
        promises.push(
          this.rataService.import(
            createdTestSummary.id,
            rata,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.protocolGasData?.length > 0 &&
      [
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.UNITDEF.toString(),
      ].includes(payload.testTypeCode)
    ) {
      for (const protocolGas of payload.protocolGasData) {
        promises.push(
          this.protocolGasService.import(
            createdTestSummary.id,
            protocolGas,
            userId,
          ),
        );
      }
    }

    if (
      payload.fuelFlowToLoadTestData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.FF2LTST
    ) {
      for (const fuelFlowToLoadTest of payload.fuelFlowToLoadTestData) {
        promises.push(
          this.fuelFlowToLoadTestWorkspaceService.import(
            createdTestSummary.id,
            fuelFlowToLoadTest,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.flowToLoadCheckData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.F2LCHK
    ) {
      for (const flowToLoadCheck of payload.flowToLoadCheckData) {
        promises.push(
          this.flowToLoadCheckWorkspaceService.import(
            createdTestSummary.id,
            flowToLoadCheck,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.fuelFlowToLoadBaselineData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.FF2LBAS
    ) {
      for (const fuelFlowToLoadBaseline of payload.fuelFlowToLoadBaselineData) {
        promises.push(
          this.fuelFlowToLoadBaselineWorkspaceService.import(
            createdTestSummary.id,
            fuelFlowToLoadBaseline,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.fuelFlowmeterAccuracyData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.FFACC
    ) {
      for (const fuelFlowmeterAccuracy of payload.fuelFlowmeterAccuracyData) {
        promises.push(
          this.fuelFlowmeterAccuracyWorkspaceService.import(
            createdTestSummary.id,
            fuelFlowmeterAccuracy,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.flowToLoadReferenceData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.F2LREF
    ) {
      for (const flowToLoadReference of payload.flowToLoadReferenceData) {
        promises.push(
          this.flowToLoadReferenceWorkspaceService.import(
            createdTestSummary.id,
            flowToLoadReference,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.appendixECorrelationTestSummaryData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.APPE
    ) {
      for (const appECorrelationTestSummary of payload.appendixECorrelationTestSummaryData) {
        promises.push(
          this.appECorrelationTestSummaryWorkspaceService.import(
            locationId,
            createdTestSummary.id,
            appECorrelationTestSummary,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.calibrationInjectionData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.SEVENDAY
    ) {
      for (const calibrationInjection of payload.calibrationInjectionData) {
        promises.push(
          this.calInjWorkspaceService.import(
            createdTestSummary.id,
            calibrationInjection,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.cycleTimeSummaryData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.CYCLE
    ) {
      for (const cycleTimeSummary of payload.cycleTimeSummaryData) {
        promises.push(
          this.cycleTimeSummaryWorkspaceService.import(
            createdTestSummary.id,
            cycleTimeSummary,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.onlineOfflineCalibrationData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.ONOFF
    ) {
      for (const onlineOfflineCalibration of payload.onlineOfflineCalibrationData) {
        promises.push(
          this.onlineOfflineCalibrationWorkspaceService.import(
            createdTestSummary.id,
            onlineOfflineCalibration,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.transmitterTransducerData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.FFACCTT
    ) {
      for (const transmitterTransducerAccuracy of payload.transmitterTransducerData) {
        promises.push(
          this.transmitterTransducerAccuracyWorkspaceService.import(
            createdTestSummary.id,
            transmitterTransducerAccuracy,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.unitDefaultTestData?.length > 0 &&
      payload.testTypeCode === TestTypeCodes.UNITDEF
    ) {
      for (const unitDefaultTest of payload.unitDefaultTestData) {
        promises.push(
          this.unitDefaultTestWorkspaceService.import(
            createdTestSummary.id,
            unitDefaultTest,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      (payload.hgSummaryData?.length > 0 &&
        payload.testTypeCode === TestTypeCodes.HGLINE) ||
      payload.testTypeCode === TestTypeCodes.HGSI3
    ) {
      for (const hgSummary of payload.hgSummaryData) {
        promises.push(
          this.hgSummaryWorkspaceService.import(
            createdTestSummary.id,
            hgSummary,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.testQualificationData?.length > 0 &&
      [TestTypeCodes.RATA.toString()].includes(payload.testTypeCode)
    ) {
      for (const testQualification of payload.testQualificationData) {
        promises.push(
          this.testQualificationWorkspaceService.import(
            createdTestSummary.id,
            testQualification,
            userId,
            historicalrecordId !== null ? true : false,
          ),
        );
      }
    }

    if (
      payload.airEmissionTestingData?.length > 0 &&
      [
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.UNITDEF.toString(),
        TestTypeCodes.APPE.toString(),
      ].includes(payload.testTypeCode)
    ) {
      for (const airEmissionTesting of payload.airEmissionTestingData) {
        promises.push(
          this.airEmissionTestingWorkspaceService.import(
            createdTestSummary.id,
            airEmissionTesting,
            userId,
            historicalrecordId !== null ? true : false,
          ),
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
    const timestamp = currentDateTime();
    const [
      reportPeriodId,
      componentRecordId,
      monitoringSystemRecordId,
    ] = await this.lookupValues(locationId, payload);

    const location = await this.monitorLocationRepository.getLocationByIdUnitIdStackPipeId(
      locationId,
      payload.unitId,
      payload.stackPipeId,
    );

    if (!location) {
      throw new EaseyException(
        new Error(
          `The provided Location Id [${locationId}] does not match the provided Unit/Stack [${
            payload.unitId ? payload.unitId : payload.stackPipeId
          }]`,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const entity = this.repository.create({
      ...payload,
      id: historicalrecordId ? historicalrecordId : uuid(),
      locationId,
      componentRecordId,
      monitoringSystemRecordId,
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
    delete dto.appendixECorrelationTestSummaryData;
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
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(`A test summary record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    const [
      reportPeriodId,
      componentRecordId,
      monitoringSystemRecordId,
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
    entity.monitoringSystemRecordId = monitoringSystemRecordId;
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
    return this.getTestSummaryById(entity.id);
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
      const entity = await this.repository.findOneBy({ id: testSumId });

      entity.userId = userId;
      entity.updateDate = timestamp;
      entity.lastUpdated = timestamp;
      entity.needsEvalFlag = 'Y';
      entity.evalStatusCode = 'EVAL';

      await this.repository.save(entity);
    }
  }

  async lookupValues(locationId: string, payload: TestSummaryBaseDTO) {
    let reportPeriodId = null;
    let componentRecordId = null;
    let monitoringSystemRecordId = null;

    if (payload.year && payload.quarter) {
      const rptPeriod = await this.reportingPeriodRepository.findOneBy({
        year: payload.year,
        quarter: payload.quarter,
      });

      reportPeriodId = rptPeriod ? rptPeriod.id : null;
    }

    if (payload.componentId) {
      const component = await this.componentRepository.findOneBy({
        locationId: locationId,
        componentID: payload.componentId,
      });

      componentRecordId = component ? component.id : null;
    }

    if (payload.monitoringSystemId) {
      const monitorSystem = await this.monSysWorkspaceRepository.findOneBy({
        locationId: locationId,
        monitoringSystemID: payload.monitoringSystemId,
      });

      monitoringSystemRecordId = monitorSystem ? monitorSystem.id : null;
    }

    return [reportPeriodId, componentRecordId, monitoringSystemRecordId];
  }
}

import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestSummaryBaseDTO,
  TestSummaryRecordDTO,
} from '../dto/test-summary.dto';

import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryParamsDTO } from '../dto/test-summary-params.dto';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';

@Injectable()
export class TestSummaryWorkspaceService {

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly map: TestSummaryMap,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly repository: TestSummaryWorkspaceRepository,
  ) {}

  async resetToNeedsEvaluation(testSumId: string, userId: string): Promise<void> {
    const entity = await this.repository.findOne(testSumId);
    const currentDate = new Date();
    entity.userId = userId;
    entity.updateDate = currentDate;
    entity.lastUpdated = currentDate;
    entity.needsEvalFlag = 'Y';
    entity.updatedStatusFlag = 'Y';    
    entity.evalStatusCode = 'EVAL';
    await this.repository.save(entity);
  }  

  async getTestSummariesByLocationId(
    locationId: string,
    params: TestSummaryParamsDTO,
  ): Promise<TestSummaryRecordDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      params.testTypeCode
    );

    return this.map.many(results);
  }

  async getTestSummaryById(
    _locationId: string,
    testSumId: string,
  ): Promise<TestSummaryRecordDTO> {
    const result = await this.repository.getTestSummaryById(testSumId);
    return this.map.one(result);
  }

  async createTestSummary(
    locationId: string,
    payload: TestSummaryBaseDTO,
  ): Promise<TestSummaryRecordDTO> {
    let reportPeriodId = null;
    let componentRecordId = null;
    let monitorSystemRecordId = null;
    const currentDate = new Date();

    if (payload.year && payload.quarter) {
      const rptPeriod = await this.repository.query(`
        SELECT rpt_period_id AS id
        FROM camdecmpsmd.reporting_period
        WHERE calendar_year = $1 AND quarter = $2`,
        [payload.year, payload.quarter]
      );

      reportPeriodId = (rptPeriod && rptPeriod.length === 1)
        ? rptPeriod[0].id
        : null;
    }

    if (payload.monitoringSystemId) {
      const monitorSystem = await this.repository.query(`
        SELECT mon_sys_id AS id
        FROM camdecmpswks.monitor_system
        WHERE mon_loc_id = $1 AND system_identifier = $2`,
        [locationId, payload.monitoringSystemId]
      );

      monitorSystemRecordId = (monitorSystem && monitorSystem.length === 1)
        ? monitorSystem[0].id
        : null;      
    }    

    if (payload.componentId) {
      const component = await this.repository.query(`
        SELECT component_id AS id
        FROM camdecmpswks.component
        WHERE mon_loc_id = $1 AND component_identifier = $2`,
        [locationId, payload.componentId]
      );

      componentRecordId = (component && component.length === 1)
        ? component[0].id
        : null;      
    }
    
    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      locationId,
      monitorSystemRecordId,
      componentRecordId,
      reportPeriodId,
      userId: 'test',
      addDate: currentDate,
      updateDate: currentDate,
      lastUpdated: currentDate,
      needsEvalFlag: 'Y',
      updatedStatusFlag: 'Y',    
      evalStatusCode: 'EVAL',
    });

    await this.repository.save(entity);
    entity = await this.repository.getTestSummaryById(entity.id);
    return this.map.one(entity);
  }  
}

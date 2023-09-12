import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QACertificationDataTypes } from '../enums/qa-certification-data-types.enum';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';

const commonSQL = (schema: string) => {
  return `
    JOIN ${schema}.monitor_plan_location mpl USING (mon_loc_id)
    JOIN (
      SELECT mon_plan_id, string_agg(unit_stack, ', ') AS configuration
      FROM (
        SELECT mon_plan_id, COALESCE(unitid, stack_name) AS unit_stack
        FROM ${schema}.monitor_plan_location mpl
        JOIN ${schema}.monitor_location ml USING(mon_loc_id)
        LEFT JOIN ${schema}.stack_pipe USING(stack_pipe_id)
        LEFT JOIN camd.unit USING(unit_id)
        ORDER BY mon_plan_id, unitid, stack_name
      ) AS d1
      GROUP BY mon_plan_id
    ) AS d USING(mon_plan_id)
    JOIN ${schema}.monitor_plan mp USING(mon_plan_id)
    JOIN camd.plant p USING(fac_id)`;
};

@Injectable()
export class WhatHasDataService {
  constructor(
    @InjectRepository(MonitorLocationRepository)
    private readonly repository: MonitorLocationRepository,
  ) {}

  async whatHasData(
    dataType: QACertificationDataTypes,
    isWorkspace: boolean = false,
  ): Promise<any> {
    let sql = null;
    const schema = isWorkspace ? 'camdecmpswks' : 'camdecmps';

    switch (dataType) {
      case QACertificationDataTypes.APPE_HI_GAS:
      case QACertificationDataTypes.APPE_HI_OIL:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration,
            period_abbreviation AS "yearQuarter"
          FROM ${schema}.${dataType}
          JOIN ${schema}.ae_correlation_test_run run USING (ae_corr_test_run_id)
          JOIN ${schema}.ae_correlation_test_sum sum USING (ae_corr_test_sum_id)
          JOIN ${schema}.test_summary ts USING (test_sum_id)
          ${commonSQL(schema)}
          LEFT JOIN camdecmpsmd.reporting_period rp USING(rpt_period_id)          
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration, period_abbreviation`;
        break;
      case QACertificationDataTypes.RATA:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration,
            period_abbreviation AS "yearQuarter"
          FROM ${schema}.${dataType}
          JOIN ${schema}.rata_summary sum USING (rata_sum_id)
          JOIN ${schema}.rata r USING (rata_id)
          JOIN ${schema}.test_summary ts USING (test_sum_id)
          ${commonSQL(schema)}
          LEFT JOIN camdecmpsmd.reporting_period rp USING(rpt_period_id)
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration, period_abbreviation`;
        break;
      case QACertificationDataTypes.RATA_FLOW:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration,
            period_abbreviation AS "yearQuarter"
          FROM ${schema}.${dataType}
          JOIN ${schema}.rata_run run USING (rata_run_id)
          JOIN ${schema}.rata_summary sum USING (rata_sum_id)
          JOIN ${schema}.rata r USING (rata_id)
          JOIN ${schema}.test_summary ts USING (test_sum_id)
          ${commonSQL(schema)}
          LEFT JOIN camdecmpsmd.reporting_period rp USING(rpt_period_id)
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration, period_abbreviation`;
        break;
      case QACertificationDataTypes.RATA_WALL_EFFECTS:
        break;
      case QACertificationDataTypes.CERT_EVENT:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration
          FROM ${schema}.${dataType}
          ${commonSQL(schema)}
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration`;
        break;
      case QACertificationDataTypes.TEST_EXT_EXEMP:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration,
            period_abbreviation AS "yearQuarter"
          FROM ${schema}.${dataType}
          ${commonSQL(schema)}
          LEFT JOIN camdecmpsmd.reporting_period rp USING(rpt_period_id)
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration, period_abbreviation`;
        break;
      default:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration,
            period_abbreviation AS "yearQuarter"
          FROM ${schema}.${dataType}
          JOIN ${schema}.test_summary ts USING (test_sum_id)
          ${commonSQL(schema)}
          LEFT JOIN camdecmpsmd.reporting_period rp USING(rpt_period_id)
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration, period_abbreviation`;
        break;
    }

    return this.repository.query(sql);
  }
}

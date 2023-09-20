import { TestExtensionExemptionMap } from './test-extension-exemption.map';
import { TestExtensionExemption } from '../entities/test-extension-exemption.entity';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { StackPipe } from '../entities/stack-pipe.entity';
import { Unit } from '../entities/unit.entity';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { Component } from '../entities/component.entity';

const string = '';
const number = 0;
const date = new Date();

const entity = new TestExtensionExemption();
entity.id = string;
entity.location = new MonitorLocation();
entity.location.id = string;
entity.location.stackPipe = new StackPipe();
entity.location.stackPipe.name = string;
entity.location.unit = new Unit();
entity.location.unit.name = string;
entity.reportingPeriod = new ReportingPeriod();
entity.reportingPeriod.year = number;
entity.reportingPeriod.quarter = number;
entity.system = new MonitorSystem();
entity.system.monitoringSystemID = string;
entity.component = new Component();
entity.component.componentID = string;
entity.hoursUsed = number;
entity.spanScaleCode = string;
entity.fuelCode = string;
entity.extensionOrExemptionCode = string;
entity.reportPeriodId = number;
entity.checkSessionId = string;
entity.submissionId = string;
entity.submissionAvailabilityCode = string;
entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('TestExtensionExemptionMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new TestExtensionExemptionMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.locationId).toEqual(string);
    expect(result.stackPipeId).toEqual(string);
    expect(result.unitId).toEqual(string);
    expect(result.year).toEqual(number);
    expect(result.quarter).toEqual(number);
    expect(result.monitoringSystemId).toEqual(string);
    expect(result.componentId).toEqual(string);
    expect(result.hoursUsed).toEqual(number);
    expect(result.spanScaleCode).toEqual(string);
    expect(result.fuelCode).toEqual(string);
    expect(result.extensionOrExemptionCode).toEqual(string);
    expect(result.reportPeriodId).toEqual(number);
    expect(result.checkSessionId).toEqual(string);
    expect(result.submissionId).toEqual(string);
    expect(result.submissionAvailabilityCode).toEqual(string);
    expect(result.pendingStatusCode).toEqual(null);
    expect(result.evalStatusCode).toEqual(null);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });

  it('should return null when addDate, updateDate, pendingStatusCode and evalStatusCode is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new TestExtensionExemptionMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

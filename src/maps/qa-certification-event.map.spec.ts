import { QACertificationEvent } from '../entities/workspace/qa-certification-event.entity';
import { QACertificationEventMap } from './qa-certification-event.map';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { Component } from '../entities/workspace/component.entity';

const date = new Date();
const someString = 'string';
const someNumber = 1;

const location = new MonitorLocation();
location.unitId = someString;
location.stackPipeId = someString;

const system = new MonitorSystem();
system.monitoringSystemID = someString;

const component = new Component();
component.componentID = someString;

const entity = new QACertificationEvent();
entity.id = someString;
entity.locationId = someString;
entity.location = location;
entity.component = component;
entity.system = system;
entity.location.unitId = someString;
entity.location.stackPipeId = component.componentID;
entity.monitoringSystemID = system.monitoringSystemID;
entity.componentID = someString;
entity.qaCertEventCode = someString;
entity.qaCertEventDate = date;
entity.qaCertEventHour = someNumber;
entity.requiredTestCode = someString;
entity.conditionalBeginDate = date;
entity.conditionalBeginHour = someNumber;
entity.completionTestDate = date;
entity.completionTestHour = someNumber;
entity.lastUpdated = date;
entity.updatedStatusFlag = someString;
entity.needsEvalFlag = someString;
entity.checkSessionId = someString;
entity.submissionId = someNumber;
entity.submissionAvailabilityCode = someString;
entity.pendindStatusCode = someString;
entity.evalStatusCode = someString;
entity.userId = someString;
entity.addDate = date;
entity.updateDate = date;

describe('QACertificationEventMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new QACertificationEventMap();

    const result = await map.one(entity);

    result.stackPipeId = location.stackPipeId;
    result.unitId = location.unitId;
    result.componentID = component.componentID;
    result.monitoringSystemID = system.monitoringSystemID;

    expect(result.id).toEqual(someString);
    expect(result.locationId).toEqual(someString);
    expect(result.unitId).toEqual(someString);
    expect(result.stackPipeId).toEqual(someString);
    expect(result.monitoringSystemID).toEqual(someString);
    expect(result.componentID).toEqual(someString);
    expect(result.qaCertEventCode).toEqual(someString);
    expect(result.qaCertEventDate).toEqual(date);
    expect(result.qaCertEventHour).toEqual(someNumber);
    expect(result.requiredTestCode).toEqual(someString);
    expect(result.conditionalBeginDate).toEqual(date);
    expect(result.conditionalBeginHour).toEqual(someNumber);
    expect(result.completionTestDate).toEqual(date);
    expect(result.completionTestHour).toEqual(someNumber);
    expect(result.lastUpdated).toEqual(date);
    expect(result.updatedStatusFlag).toEqual(someString);
    expect(result.needsEvalFlag).toEqual(someString);
    expect(result.checkSessionId).toEqual(someString);
    expect(result.submissionId).toEqual(someNumber);
    expect(result.submissionAvailabilityCode).toEqual(someString);
    expect(result.pendindStatusCode).toEqual(someString);
    expect(result.evalStatusCode).toEqual(someString);
    expect(result.userId).toEqual(someString);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    const map = new QACertificationEventMap();

    entity.addDate = undefined;
    entity.updateDate = undefined;

    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

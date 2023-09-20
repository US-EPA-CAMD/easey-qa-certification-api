import { QACertificationEvent } from '../entities/qa-certification-event.entity';
import { QACertificationEventMap } from './qa-certification-event.map';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorSystem } from '../entities/monitor-system.entity';
import { Component } from '../entities/component.entity';
import { StackPipe } from '../entities/stack-pipe.entity';
import { Unit } from '../entities/unit.entity';

const date = new Date();
const someString = 'string';
const someNumber = 1;

const location = new MonitorLocation();
location.id = someString;
location.stackPipe = new StackPipe();
location.stackPipe.name = someString;
location.unit = new Unit();
location.unit.name = someString;
const system = new MonitorSystem();
system.monitoringSystemID = someString;

const component = new Component();
component.componentID = someString;

const entity = new QACertificationEvent();
entity.id = someString;
entity.location = location;
location.unit.name = someString;
location.stackPipe.name = someString;
entity.component = component;
entity.system = system;
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
entity.userId = someString;
entity.addDate = date;
entity.updateDate = date;

describe('QACertificationEventMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new QACertificationEventMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(someString);
    expect(result.locationId).toEqual(someString);
    expect(result.unitId).toEqual(someString);
    expect(result.stackPipeId).toEqual(someString);
    expect(result.monitoringSystemId).toEqual(someString);
    expect(result.componentId).toEqual(someString);
    expect(result.certificationEventCode).toEqual(someString);
    expect(result.certificationEventDate).toEqual(date);
    expect(result.certificationEventHour).toEqual(someNumber);
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
    // expect(result.evalStatusCode).toEqual(someString);
    // expect(result.pendingStatusCode).toEqual(someString);
    expect(result.userId).toEqual(someString);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });

  it('should return null when addDate, updateDate, pendingStatusCode and evalStatusCode is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;
    location.stackPipe = null;
    location.unit = null;
    entity.component = null;
    entity.system = null;

    const map = new QACertificationEventMap();
    const result = await map.one(entity);

    expect(result.stackPipeId).toEqual(null);
    expect(result.unitId).toEqual(null);
    expect(result.monitoringSystemId).toEqual(null);
    expect(result.componentId).toEqual(null);
    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
    expect(result.pendingStatusCode).toEqual(null);
    expect(result.evalStatusCode).toEqual(null);
  });
});

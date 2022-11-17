import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';
import { CycleTimeInjectionMap } from './cycle-time-injection.map';

const string = '';
const number = 1;
const date = new Date(Date.now());

const entity = new CycleTimeInjection();

entity.id = string;
entity.cycleTimeSumId = string;
entity.gasLevelCode = string;
entity.calibrationGasValue = number;
entity.beginDate = date;
entity.beginHour = number;
entity.beginMinute = number;
entity.endDate = date;
entity.endHour = number;
entity.endMinute = number;
entity.injectionCycleTime = number;
entity.beginMonitorValue = number;
entity.endMonitorValue = number;
entity.calculatedInjectionCycleTime = number;
entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('CycleTimeInjectionMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new CycleTimeInjectionMap();

    const result = await map.one(entity);
    result.addDate = date.toLocaleString();
    result.addDate = date.toLocaleString();

    expect(result.id).toEqual(string);
    expect(result.cycleTimeSumId).toEqual(string);
    expect(result.gasLevelCode).toEqual(string);
    expect(result.calibrationGasValue).toEqual(number);
    expect(result.beginDate).toEqual(date);
    expect(result.beginHour).toEqual(number);
    expect(result.beginMinute).toEqual(number);
    expect(result.endDate).toEqual(date);
    expect(result.endHour).toEqual(number);
    expect(result.endMinute).toEqual(number);
    expect(result.injectionCycleTime).toEqual(number);
    expect(result.beginMonitorValue).toEqual(number);
    expect(result.endMonitorValue).toEqual(number);
    expect(result.calculatedInjectionCycleTime).toEqual(number);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });
});

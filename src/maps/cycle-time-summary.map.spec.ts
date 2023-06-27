import { CycleTimeSummary } from '../entities/cycle-time-summary.entity';
import { CycleTimeInjectionMap } from './cycle-time-injection.map';
import { CycleTimeSummaryMap } from './cycle-time-summary.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new CycleTimeSummary();
entity.id = string;
entity.testSumId = string;

entity.totalTime = number;
entity.calculatedTotalTime = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('CycleTimeSummaryMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new CycleTimeSummaryMap(new CycleTimeInjectionMap());
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.totalTime).toEqual(number);
    expect(result.calculatedTotalTime).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new CycleTimeSummaryMap(new CycleTimeInjectionMap());
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

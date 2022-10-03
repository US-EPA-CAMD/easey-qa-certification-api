import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { AppECorrelationTestRunMap } from './app-e-correlation-test-run.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new AppECorrelationTestRun();
entity.id = string;
entity.appECorrTestSumId = string;

entity.runNumber = number;
entity.referenceValue = number;
entity.hourlyHeatInputRate = number;
entity.calculatedHourlyHeatInputRate = number;
entity.totalHeatInput = number;
entity.calculatedTotalHeatInput = number;
entity.responseTime = number;
entity.beginDate = date;
entity.beginHour = number;
entity.beginMinute = number;
entity.endDate = date;
entity.endHour = number;
entity.endMinute = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('AppECorrelationTestRunMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new AppECorrelationTestRunMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.appECorrTestSumId).toEqual(string);

    expect(result.runNumber).toEqual(number);
    expect(result.referenceValue).toEqual(number);
    expect(result.hourlyHeatInputRate).toEqual(number);
    expect(result.calculatedHourlyHeatInputRate).toEqual(number);
    expect(result.totalHeatInput).toEqual(number);
    expect(result.calculatedTotalHeatInput).toEqual(number);
    expect(result.responseTime).toEqual(number);
    expect(result.beginDate).toEqual(date);
    expect(result.beginHour).toEqual(number);
    expect(result.beginMinute).toEqual(number);
    expect(result.endDate).toEqual(date);
    expect(result.endHour).toEqual(number);
    expect(result.endMinute).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new AppECorrelationTestRunMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryMap } from './app-e-correlation-summary.map';
import { AppECorrelationTestRunMap } from './app-e-correlation-test-run.map';
import { AppEHeatInputFromGasMap } from './app-e-heat-input-from-gas.map';
import { AppEHeatInputFromOilMap } from './app-e-heat-input-from-oil.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new AppECorrelationTestSummary();
entity.id = string;
entity.testSumId = string;

entity.operatingLevelForRun = number;
entity.meanReferenceValue = number;
entity.averageHourlyHeatInputRate = number;
entity.fFactor = number;
entity.calculatedMeanReferenceValue = number;
entity.calculatedAverageHourlyHeatInputRate = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('AppECorrelationTestSummaryMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new AppECorrelationTestSummaryMap(
      new AppECorrelationTestRunMap(
        new AppEHeatInputFromOilMap(),
        new AppEHeatInputFromGasMap(),
      ),
    );
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.operatingLevelForRun).toEqual(number);
    expect(result.meanReferenceValue).toEqual(number);
    expect(result.averageHourlyHeatInputRate).toEqual(number);
    expect(result.fFactor).toEqual(number);
    expect(result.calculatedMeanReferenceValue).toEqual(number);
    expect(result.calculatedAverageHourlyHeatInputRate).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new AppECorrelationTestSummaryMap(
      new AppECorrelationTestRunMap(
        new AppEHeatInputFromOilMap(),
        new AppEHeatInputFromGasMap(),
      ),
    );
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

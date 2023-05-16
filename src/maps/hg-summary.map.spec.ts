import { HgSummary } from '../entities/hg-summary.entity';
import { HgInjectionMap } from './hg-injection.map';
import { HgSummaryMap } from './hg-summary.map';

const string = '';
const number = 1;
const date = new Date(Date.now());

const entity = new HgSummary();

entity.id = string;
entity.testSumId = string;

entity.gasLevelCode = string;
entity.meanMeasuredValue = number;
entity.calculatedMeanMeasuredValue = number;
entity.meanReferenceValue = number;
entity.calculatedMeanReferenceValue = number;
entity.percentError = number;
entity.calculatedPercentError = number;
entity.apsIndicator = number;
entity.calculatedAPSIndicator = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('HgSummaryMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new HgSummaryMap(new HgInjectionMap());

    const result = await map.one(entity);
    result.addDate = date.toISOString();
    result.updateDate = date.toISOString();

    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.gasLevelCode).toEqual(string);
    expect(result.meanMeasuredValue).toEqual(number);
    expect(result.calculatedMeanMeasuredValue).toEqual(number);
    expect(result.meanReferenceValue).toEqual(number);
    expect(result.calculatedMeanReferenceValue).toEqual(number);
    expect(result.percentError).toEqual(number);
    expect(result.calculatedPercentError).toEqual(number);
    expect(result.apsIndicator).toEqual(number);
    expect(result.calculatedAPSIndicator).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });
});

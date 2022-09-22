import { Rata } from '../entities/rata.entity';
import { RataRunMap } from './rata-run.map';
import { RataSummaryMap } from './rata-summary.map';
import { RataMap } from './rata.map';
import { FlowRataRunMap } from './flow-rata-run.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new Rata();
entity.id = string;
entity.testSumId = string;
entity.rataFrequencyCode = string;
entity.calculatedRataFrequencyCode = string;
entity.relativeAccuracy = number;
entity.calculatedRelativeAccuracy = number;
entity.overallBiasAdjustmentFactor = number;
entity.calculatedOverallBiasAdjustmentFactor = number;
entity.numberOfLoadLevels = number;
entity.calculatedNumberOfLoadLevels = number;
entity.userId = string;
entity.addDate = date;
entity.updateDate = date;
entity.rataSummaries = [];

describe('RataMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new RataMap(
      new RataSummaryMap(new RataRunMap(new FlowRataRunMap())),
    );
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);
    expect(result.rataFrequencyCode).toEqual(string);
    expect(result.calculatedRataFrequencyCode).toEqual(string);
    expect(result.relativeAccuracy).toEqual(number);
    expect(result.calculatedRelativeAccuracy).toEqual(number);
    expect(result.overallBiasAdjustmentFactor).toEqual(number);
    expect(result.calculatedOverallBiasAdjustmentFactor).toEqual(number);
    expect(result.numberOfLoadLevels).toEqual(number);
    expect(result.calculatedNumberOfLoadLevel).toEqual(number);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
    expect(result.rataSummaryData).toEqual([]);
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new RataMap(
      new RataSummaryMap(new RataRunMap(new FlowRataRunMap())),
    );
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

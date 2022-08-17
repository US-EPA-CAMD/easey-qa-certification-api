import { Rata } from '../entities/rata.entity';
import { RataMap } from './rata.map';

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
entity.numberLoadLevel = number;
entity.calculatedNumberLoadLevel = number;
entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('RataMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new RataMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);
    expect(result.rataFrequencyCode).toEqual(string);
    expect(result.calculatedRataFrequencyCode).toEqual(string);
    expect(result.relativeAccuracy).toEqual(number);
    expect(result.calculatedRelativeAccuracy).toEqual(number);
    expect(result.overallBiasAdjustmentFactor).toEqual(number);
    expect(result.calculatedOverallBiasAdjustmentFactor).toEqual(number);
    expect(result.numberLoadLevel).toEqual(number);
    expect(result.calculatedNumberLoadLevel).toEqual(number);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });
});
import { RataSummary } from '../entities/rata-summary.entity';
import { RataSummaryMap } from './rata-summary.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new RataSummary();
entity.id = string;
entity.rataId = string;

entity.operatingLevelCode = string;
entity.averageGrossUnitLoad = number;
entity.referenceMethodCode = string;
entity.meanCEMValue = number;
entity.meanRATAReferenceValue = number;
entity.meanDifference = number;
entity.standardDeviationDifference = number;
entity.confidenceCoefficient = number;
entity.tValue = number;
entity.apsIndicator = number;
entity.apsCode = string;
entity.relativeAccuracy = number;
entity.biasAdjustmentFactor = number;
entity.co2OrO2ReferenceMethodCode = string;
entity.stackDiameter = number;
entity.stackArea = number;
entity.numberOfTraversePoints = number;
entity.calculatedWAF = number;
entity.defaultWAF = number;

entity.calculatedAverageGrossUnitLoad = number;
entity.calculatedMeanCEMValue = number;
entity.calculatedMeanRATAReferenceValue = number;
entity.calculatedMeanDifference = number;
entity.calculatedStandardDeviationDifference = number;
entity.calculatedConfidenceCoefficient = number;
entity.calculatedTValue = number;
entity.calculatedApsIndicator = number;
entity.calculatedRelativeAccuracy = number;
entity.calculatedBiasAdjustmentFactor = number;
entity.calculatedStackArea = number;
entity.calculatedCalculatedWAF = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('RataSummaryMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new RataSummaryMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.rataId).toEqual(string);

    expect(result.operatingLevelCode).toEqual(string);
    expect(result.averageGrossUnitLoad).toEqual(number);
    expect(result.referenceMethodCode).toEqual(string);
    expect(result.meanCEMValue).toEqual(number);
    expect(result.meanRATAReferenceValue).toEqual(number);
    expect(result.meanDifference).toEqual(number);
    expect(result.standardDeviationDifference).toEqual(number);
    expect(result.confidenceCoefficient).toEqual(number);
    expect(result.tValue).toEqual(number);
    expect(result.apsIndicator).toEqual(number);
    expect(result.apsCode).toEqual(string);
    expect(result.relativeAccuracy).toEqual(number);
    expect(result.biasAdjustmentFactor).toEqual(number);
    expect(result.co2OrO2ReferenceMethodCode).toEqual(string);
    expect(result.stackDiameter).toEqual(number);
    expect(result.stackArea).toEqual(number);
    expect(result.numberOfTraversePoints).toEqual(number);
    expect(result.calculatedWAF).toEqual(number);
    expect(result.defaultWAF).toEqual(number);

    expect(result.calculatedAverageGrossUnitLoad).toEqual(number);
    expect(result.calculatedMeanCEMValue).toEqual(number);
    expect(result.calculatedMeanRATAReferenceValue).toEqual(number);
    expect(result.calculatedMeanDifference).toEqual(number);
    expect(result.calculatedStandardDeviationDifference).toEqual(number);
    expect(result.calculatedConfidenceCoefficient).toEqual(number);
    expect(result.calculatedTValue).toEqual(number);
    expect(result.calculatedApsIndicator).toEqual(number);
    expect(result.calculatedRelativeAccuracy).toEqual(number);
    expect(result.calculatedBiasAdjustmentFactor).toEqual(number);
    expect(result.calculatedStackArea).toEqual(number);
    expect(result.calculatedCalculatedWAF).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new RataSummaryMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

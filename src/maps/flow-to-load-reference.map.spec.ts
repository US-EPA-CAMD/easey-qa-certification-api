import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';
import { FlowToLoadReferenceMap } from './flow-to-load-reference.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new FlowToLoadReference();
entity.id = string;
entity.testSumId = string;

entity.operatingLevelCode = string;
entity.rataTestNumber = string;
entity.averageGrossUnitLoad = number;
entity.averageReferenceMethodFlow = number;
entity.referenceFlowLoadRatio = number;
entity.averageHourlyHeatInputRate = number;
entity.referenceGrossHeatRate = number;
entity.calculatedSeparateReferenceIndicator = number;

entity.calculatedAverageGrossUnitLoad = number;
entity.calculatedAverageReferenceMethodFlow = number;
entity.calculatedReferenceFlowToLoadRatio = number;
entity.calculatedReferenceGrossHeatRate = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('FlowToLoadReferenceMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new FlowToLoadReferenceMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);
    expect(result.operatingLevelCode).toEqual(string);
    expect(result.rataTestNumber).toEqual(string);
    expect(result.averageGrossUnitLoad).toEqual(number);
    expect(result.averageReferenceMethodFlow).toEqual(number);
    expect(result.referenceFlowLoadRatio).toEqual(number);
    expect(result.averageHourlyHeatInputRate).toEqual(number);
    expect(result.referenceGrossHeatRate).toEqual(number);
    expect(result.calculatedSeparateReferenceIndicator).toEqual(number);
    expect(result.calculatedAverageGrossUnitLoad).toEqual(number);
    expect(result.calculatedAverageReferenceMethodFlow).toEqual(number);
    expect(result.calculatedReferenceFlowToLoadRatio).toEqual(number);
    expect(result.calculatedReferenceGrossHeatRate).toEqual(number);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new FlowToLoadReferenceMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

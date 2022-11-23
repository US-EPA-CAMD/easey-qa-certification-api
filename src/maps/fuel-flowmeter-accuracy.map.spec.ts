import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';
import { FuelFlowmeterAccuracyMap } from './fuel-flowmeter-accuracy.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new FuelFlowmeterAccuracy();
entity.id = string;
entity.testSumId = string;

entity.accuracyTestMethodCode = string;
entity.reinstallationDate = string;
entity.reinstallationHour = number;
entity.lowFuelAccuracy = number;
entity.midFuelAccuracy = number;
entity.highFuelAccuracy = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('FuelFlowmeterAccuracyMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new FuelFlowmeterAccuracyMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.accuracyTestMethodCode).toEqual(string);
    expect(result.reinstallationDate).toEqual(string);
    expect(result.reinstallationHour).toEqual(number);
    expect(result.lowFuelAccuracy).toEqual(number);
    expect(result.midFuelAccuracy).toEqual(number);
    expect(result.highFuelAccuracy).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new FuelFlowmeterAccuracyMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

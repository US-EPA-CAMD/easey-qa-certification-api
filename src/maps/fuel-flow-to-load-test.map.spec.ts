import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';
import { FuelFlowToLoadTestMap } from './fuel-flow-to-load-test.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new FuelFlowToLoadTest();
entity.id = string;
entity.testSumId = string;

entity.testBasisCode = string;
entity.averageDifference = number;
entity.numberOfHoursUsed = number;
entity.numberOfHoursExcludedCofiring = number;
entity.numberOfHoursExcludedRamping = number;
entity.numberOfHoursExcludedLowRange = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('FuelFlowToLoadTestMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new FuelFlowToLoadTestMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.testBasisCode).toEqual(string);
    expect(result.averageDifference).toEqual(number);
    expect(result.numberOfHoursUsed).toEqual(number);
    expect(result.numberOfHoursExcludedCofiring).toEqual(number);
    expect(result.numberOfHoursExcludedRamping).toEqual(number);
    expect(result.numberOfHoursExcludedLowRange).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new FuelFlowToLoadTestMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

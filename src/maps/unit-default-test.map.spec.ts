import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { UnitDefaultTestMap } from './unit-default-test.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new UnitDefaultTest();
entity.id = string;
entity.testSumId = string;

entity.fuelCode = string;
entity.noxDefaultRate = number;
entity.calculatedNoxDefaultRate = number;
entity.operatingConditionCode = string;
entity.groupId = string;
entity.numberOfUnitsInGroup = number;
entity.numberOfTestsForGroup = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('UnitDefaultTestMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new UnitDefaultTestMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.fuelCode).toEqual(string);
    expect(result.noxDefaultRate).toEqual(number);
    expect(result.calculatedNoxDefaultRate).toEqual(number);
    expect(result.operatingConditionCode).toEqual(string);
    expect(result.groupId).toEqual(string);
    expect(result.numberOfUnitsInGroup).toEqual(number);
    expect(result.numberOfTestsForGroup).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new UnitDefaultTestMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

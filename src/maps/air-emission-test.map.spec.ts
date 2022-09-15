import { AirEmissionTest } from '../entities/air-emission-test';
import { AirEmissionTestMap } from './air-emission-test.map';

const string = '';
const date = new Date();

const entity = new AirEmissionTest();
entity.id = string;
entity.testSumId = string;

entity.qiLastName = string;
entity.qiFirstName = string;
entity.qiMiddleInitial = string;
entity.aetbName = string;
entity.aetbPhoneNumber = string;
entity.aetbEmail = string;
entity.examDate = date;
entity.providerName = string;
entity.providerEmail = string;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('AirEmissionTestMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new AirEmissionTestMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.qiLastName).toEqual(string);
    expect(result.qiFirstName).toEqual(string);
    expect(result.qiMiddleInitial).toEqual(string);
    expect(result.aetbName).toEqual(string);
    expect(result.aetbPhoneNumber).toEqual(string);
    expect(result.aetbEmail).toEqual(string);
    expect(result.examDate).toEqual(date);
    expect(result.providerName).toEqual(string);
    expect(result.providerEmail).toEqual(string);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new AirEmissionTestMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

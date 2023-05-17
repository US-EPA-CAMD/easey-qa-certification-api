import { TestQualification } from '../entities/test-qualification.entity';
import { TestQualificationMap } from './test-qualification.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new TestQualification();
entity.id = string;
entity.testSumId = string;

entity.testClaimCode = string;
entity.beginDate = date;
entity.endDate = date;
entity.highLoadPercentage = number;
entity.midLoadPercentage = number;
entity.lowLoadPercentage = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('TestQualificationMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new TestQualificationMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);
    expect(result.testClaimCode).toEqual(string);

    expect(result.beginDate).toEqual(date);
    expect(result.endDate).toEqual(date);
    expect(result.highLoadPercentage).toEqual(number);
    expect(result.midLoadPercentage).toEqual(number);
    expect(result.lowLoadPercentage).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new TestQualificationMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

import { HgInjection } from '../entities/hg-injection.entity';
import { HgInjectionMap } from './hg-injection.map';

const string = '';
const number = 1;
const date = new Date(Date.now());

const entity = new HgInjection();

entity.id = string;
entity.hgTestSumId = string;

entity.injectionHour = number;
entity.injectionMinute = number;
entity.measuredValue = number;
entity.referenceValue = number;
entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('HgInjectionMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new HgInjectionMap();

    const result = await map.one(entity);
    result.addDate = date.toISOString();
    result.addDate = date.toISOString();

    expect(result.id).toEqual(string);
    expect(result.hgTestSumId).toEqual(string);

    expect(result.injectionHour).toEqual(number);
    expect(result.injectionMinute).toEqual(number);
    expect(result.measuredValue).toEqual(number);
    expect(result.referenceValue).toEqual(number);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });
});

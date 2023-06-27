import { LinearityInjection } from '../entities/linearity-injection.entity';
import { LinearityInjectionMap } from './linearity-injection.map';

const string = '';
const number = 1;
const date = new Date();

const entity = new LinearityInjection();
entity.id = string;
entity.linSumId = string;
entity.injectionDate = date;
entity.injectionHour = number;
entity.injectionMinute = number;
entity.measuredValue = number;
entity.referenceValue = number;
entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('LinearityInjectionMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new LinearityInjectionMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.linSumId).toEqual(string);
    expect(result.injectionDate).toEqual(date);
    expect(result.injectionHour).toEqual(number);
    expect(result.injectionMinute).toEqual(number);
    expect(result.measuredValue).toEqual(number);
    expect(result.referenceValue).toEqual(number);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toISOString());
    expect(result.updateDate).toEqual(date.toISOString());
  });
});

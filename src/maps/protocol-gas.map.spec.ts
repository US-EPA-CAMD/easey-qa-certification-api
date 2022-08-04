import { ProtocolGas } from '../entities/protocol-gas.entity';
import { ProtocolGasMap } from './protocol-gas.map';

const string = '';
const date = new Date();

const entity = new ProtocolGas();
entity.id = string;
entity.testSumId = string;
entity.gasLevelCode = string;
entity.gasTypeCode = string;
entity.vendorID = string;
entity.cylinderID = string;
entity.expirationDate = date;
entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('ProtocolGasMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new ProtocolGasMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);
    expect(result.gasLevelCode).toEqual(string);
    expect(result.gasTypeCode).toEqual(string);
    expect(result.vendorID).toEqual(string);
    expect(result.cylinderID).toEqual(string);
    expect(result.expirationDate).toEqual(date);
    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date);
    expect(result.updateDate).toEqual(date);
  });
});

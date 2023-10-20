import { FuelFlowToLoadBaseline } from '../entities/fuel-flow-to-load-baseline.entity';
import { FuelFlowToLoadBaselineMap } from './fuel-flow-to-load-baseline.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new FuelFlowToLoadBaseline();
entity.id = string;
entity.testSumId = string;

entity.accuracyTestNumber = string;
entity.peiTestNumber = string;
entity.averageFuelFlowRate = number;
entity.averageLoad = number;
entity.baselineFuelFlowToLoadRatio = number;
entity.fuelFlowToLoadUnitsOfMeasureCode = string;
entity.averageHourlyHeatInputRate = number;
entity.baselineGHR = number;
entity.ghrUnitsOfMeasureCode = string;

entity.numberOfHoursExcludedCofiring = number;
entity.numberOfHoursExcludedRamping = number;
entity.numberOfHoursExcludedLowRange = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('FuelFlowToLoadBaselineMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new FuelFlowToLoadBaselineMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.accuracyTestNumber).toEqual(string);
    expect(result.peiTestNumber).toEqual(string);
    expect(result.averageFuelFlowRate).toEqual(number);
    expect(result.averageLoad).toEqual(number);
    expect(result.baselineFuelFlowToLoadRatio).toEqual(number);
    expect(result.fuelFlowToLoadUnitsOfMeasureCode).toEqual(string);
    expect(result.averageHourlyHeatInputRate).toEqual(number);
    expect(result.baselineGHR).toEqual(number);
    expect(result.ghrUnitsOfMeasureCode).toEqual(string);
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

    const map = new FuelFlowToLoadBaselineMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

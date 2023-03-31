import { CalibrationInjection } from '../entities/calibration-injection.entity';
import { CalibrationInjectionMap } from './calibration-injection.map';

const string = '';
const number = 0;
const date = new Date();

const entity = new CalibrationInjection();
entity.id = string;
entity.testSumId = string;

entity.onLineOfflineIndicator = number;
entity.upscaleGasLevelCode = string;

entity.zeroInjectionDate = date;
entity.zeroInjectionHour = number;
entity.zeroInjectionMinute = number;
entity.upscaleInjectionDate = date;
entity.upscaleInjectionHour = number;
entity.upscaleInjectionMinute = number;
entity.zeroMeasuredValue = number;
entity.upscaleMeasuredValue = number;

entity.zeroAPSIndicator = number;
entity.calculatedZeroAPSIndicator = number;
entity.upscaleAPSIndicator = number;
entity.calculatedUpscaleAPSIndicator = number;
entity.zeroCalibrationError = number;
entity.calculatedZeroCalibrationError = number;
entity.upscaleCalibrationError = number;
entity.calculatedUpscaleCalibrationError = number;

entity.zeroReferenceValue = number;
entity.upscaleReferenceValue = number;

entity.userId = string;
entity.addDate = date;
entity.updateDate = date;

describe('CalibrationInjectionMap', () => {
  it('should map an entity to a dto', async () => {
    const map = new CalibrationInjectionMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(string);
    expect(result.testSumId).toEqual(string);

    expect(result.onLineOfflineIndicator).toEqual(number);
    expect(result.upscaleGasLevelCode).toEqual(string);

    expect(result.zeroInjectionDate).toEqual(date);
    expect(result.zeroInjectionHour).toEqual(number);
    expect(result.zeroInjectionMinute).toEqual(number);
    expect(result.upscaleInjectionDate).toEqual(date);
    expect(result.upscaleInjectionHour).toEqual(number);
    expect(result.upscaleInjectionMinute).toEqual(number);

    expect(result.zeroMeasuredValue).toEqual(number);
    expect(result.upscaleMeasuredValue).toEqual(number);

    expect(result.zeroAPSIndicator).toEqual(number);
    expect(result.calculatedZeroAPSIndicator).toEqual(number);

    expect(result.upscaleAPSIndicator).toEqual(number);
    expect(result.calculatedUpscaleAPSIndicator).toEqual(number);

    expect(result.zeroCalibrationError).toEqual(number);
    expect(result.calculatedZeroCalibrationError).toEqual(number);

    expect(result.upscaleCalibrationError).toEqual(number);
    expect(result.calculatedUpscaleCalibrationError).toEqual(number);

    expect(result.zeroReferenceValue).toEqual(number);
    expect(result.upscaleReferenceValue).toEqual(number);

    expect(result.userId).toEqual(string);
    expect(result.addDate).toEqual(date.toLocaleString());
    expect(result.updateDate).toEqual(date.toLocaleString());
  });

  it('should return null when addDate and updateDate is undefined', async () => {
    entity.addDate = undefined;
    entity.updateDate = undefined;

    const map = new CalibrationInjectionMap();
    const result = await map.one(entity);

    expect(result.addDate).toEqual(null);
    expect(result.updateDate).toEqual(null);
  });
});

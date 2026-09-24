import { validate } from 'class-validator';

import { IsInDateRangeOrCurrentQuarter } from './is-in-date-range-or-current-quarter.pipe';

class TestDto {
  @IsInDateRangeOrCurrentQuarter('1993-01-01')
  endDate?: string;
}

describe('IsInDateRangeOrCurrentQuarter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-26T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('accepts an end date before today', async () => {
    const dto = new TestDto();
    dto.endDate = '2026-06-30';

    const result = await validate(dto);

    expect(result).toEqual([]);
  });

  it('accepts a future end date within the current quarter', async () => {
    const dto = new TestDto();
    dto.endDate = '2026-09-15';

    const result = await validate(dto);

    expect(result).toEqual([]);
  });

  it('accepts the current quarter end date', async () => {
    const dto = new TestDto();
    dto.endDate = '2026-09-30';

    const result = await validate(dto);

    expect(result).toEqual([]);
  });

  it('rejects future end dates outside the current quarter range', async () => {
    const dto = new TestDto();
    dto.endDate = '2026-12-31';

    const result = await validate(dto);

    expect(result).toHaveLength(1);
  });

  it('rejects end dates before the minimum date', async () => {
    const dto = new TestDto();
    dto.endDate = '1992-12-31';

    const result = await validate(dto);

    expect(result).toHaveLength(1);
  });
});

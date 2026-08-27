import { validate } from 'class-validator';

import { IsInDateRangeOrCurrentQuarter } from './is-in-date-range-or-current-quarter.pipe';

class TestDto {
  beginDate?: string;

  @IsInDateRangeOrCurrentQuarter('1993-01-01', {
    beginDateField: 'beginDate',
  })
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

  it('accepts an end date on or before today', async () => {
    const dto = new TestDto();
    dto.beginDate = '2026-07-01';
    dto.endDate = '2026-08-26';

    const result = await validate(dto);

    expect(result).toEqual([]);
  });

  it('accepts the current quarter end date when paired with the current quarter begin date', async () => {
    const dto = new TestDto();
    dto.beginDate = '2026-07-01';
    dto.endDate = '2026-09-30';

    const result = await validate(dto);

    expect(result).toEqual([]);
  });

  it('rejects future end dates outside the current quarter range', async () => {
    const dto = new TestDto();
    dto.beginDate = '2026-10-01';
    dto.endDate = '2026-12-31';

    const result = await validate(dto);

    expect(result).toHaveLength(1);
  });
});

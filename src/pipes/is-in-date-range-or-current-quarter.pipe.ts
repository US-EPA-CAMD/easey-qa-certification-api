import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

const formatDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const normalizeDate = (value: unknown) => {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string') {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDate(value);
  }

  const parsedDate = new Date(value as string);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return formatDate(parsedDate);
};

const getCurrentQuarterRange = (today: Date) => {
  const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
  const startDate = new Date(today.getFullYear(), quarterStartMonth, 1);
  const endDate = new Date(today.getFullYear(), quarterStartMonth + 3, 0);

  return {
    beginDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export function IsInDateRangeOrCurrentQuarter(
  minDate: string,
  validationOptions?: ValidationOptions & { beginDateField?: string },
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isInDateRangeOrCurrentQuarter',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [minDate, validationOptions?.beginDateField ?? 'beginDate'],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [minimumDate, beginDateField] = args.constraints;
          const normalizedEndDate = normalizeDate(value);

          if (!normalizedEndDate) {
            return true;
          }

          const today = new Date();
          const normalizedToday = formatDate(today);

          if (
            normalizedEndDate >= minimumDate &&
            normalizedEndDate <= normalizedToday
          ) {
            return true;
          }

          const normalizedBeginDate = normalizeDate(
            (args.object as Record<string, unknown>)[beginDateField],
          );

          if (!normalizedBeginDate) {
            return false;
          }

          const currentQuarter = getCurrentQuarterRange(today);

          return (
            normalizedBeginDate === currentQuarter.beginDate &&
            normalizedEndDate === currentQuarter.endDate &&
            normalizedBeginDate <= normalizedToday
          );
        },
      },
    });
  };
}

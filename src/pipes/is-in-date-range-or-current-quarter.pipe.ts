import { registerDecorator, ValidationOptions } from 'class-validator';

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

const getCurrentQuarterEndDate = (today: Date) => {
  const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;

  return formatDate(new Date(today.getFullYear(), quarterStartMonth + 3, 0));
};

export function IsInDateRangeOrCurrentQuarter(
  minDate: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isInDateRangeOrCurrentQuarter',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          const normalizedDate = normalizeDate(value);

          if (!normalizedDate) {
            return true;
          }

          const currentQuarterEndDate = getCurrentQuarterEndDate(new Date());

          return (
            normalizedDate >= minDate && normalizedDate <= currentQuarterEndDate
          );
        },
      },
    });
  };
}

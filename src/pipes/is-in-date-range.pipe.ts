import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsInDateRange(
  minDate: string,
  maxDate?: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInDateRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (value) {
            const dateObject = new Date(value);
            const minDateDate = new Date(minDate);
            const maxDateDate =
              maxDate !== undefined && maxDate !== null
                ? new Date(maxDate)
                : new Date();
            return dateObject >= minDateDate && dateObject <= maxDateDate;
          }
          return true;
        },
      },
    });
  };
}

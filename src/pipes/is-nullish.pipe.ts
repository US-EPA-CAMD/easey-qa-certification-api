import { applyDecorators } from '@nestjs/common';
import { IsIn, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsNullish(
  validationOptions?: ValidationOptions,
) {
  return applyDecorators(
    IsIn([null, undefined], {
      message: (args: ValidationArguments) => {
        return `${args.property} must be null or undefined`;
      },
      ...validationOptions,
    }),
  );
}

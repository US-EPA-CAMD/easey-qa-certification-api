import { applyDecorators } from '@nestjs/common';
import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsOptionalIf(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return applyDecorators(
    ValidateIf((object, value) => {
      // Skip validation if value is empty (null or undefined) and condition is true.
      return (
        !(value === undefined || value === null) || !condition(object, value)
      );
    }, validationOptions),
  );
}

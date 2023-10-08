import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import { FindManyOptions, getManager } from 'typeorm';

// TODO: MOVE TO COMMON PIPES
export function IsValidCodes(
  type: any,
  findOption: (ValidationArguments: ValidationArguments) => FindManyOptions,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCodes',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: string | string[], args: ValidationArguments) {
          if (value) {
            if (typeof value === 'string' && value.includes(',')) {
              value = value.split(',');
            }
            if (typeof value === 'string' && value.includes('|')) {
              value = value.split('|');
            }
            const manager = getManager();
            const found = await manager.find(type, findOption(args));
            return found.length === value.length;
          }
          return true;
        },
      },
    });
  };
}

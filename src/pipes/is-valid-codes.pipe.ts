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
            if (typeof value === 'string') {
              if (value.includes(',')) {
                value = value.split(',');
              } else if (value.includes('|')) {
                value = value.split('|');
              } else {
                value = [value];
              }
            }
            value = value.filter((v) => v !== '')
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

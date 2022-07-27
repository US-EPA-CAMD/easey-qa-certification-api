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
        async validate(value: any, args: ValidationArguments) {
          if (value) {
            const manager = getManager();
            const found = await manager.findOne(type, findOption(args));
            return found != null;
          }
          return true;
        },
      },
    });
  };
}

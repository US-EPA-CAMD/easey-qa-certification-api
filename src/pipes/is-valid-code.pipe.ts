import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

import { getManager } from 'typeorm';

// TODO: MOVE TO COMMONE PIPES
export function IsValidCode(type: any, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, _args: ValidationArguments) {
          if (value) {
            const manager = getManager();
            const found = await manager.findOne(type, value);
            return found != null;
          }
          return true;
        },
      },
    });
  };
}

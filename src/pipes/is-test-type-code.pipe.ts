import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

import { getManager } from 'typeorm';

import { TestTypeCode } from "../entities/test-type-code.entity";

export function IsTestTypeCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isTestTypeCode",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, _args: ValidationArguments) {
          if (value) {
            const manager = getManager();
            const found = await manager.findOne(TestTypeCode, {
              testTypeCode: value,
            });
            return found != null;
          }
          return true;
        },
      },
    });
  };
}

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ArrayContains(
  property: string[],
  validationOptions?: ValidationOptions
  ) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'ArrayContains',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value && property) {
            if (property.includes(value)) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}

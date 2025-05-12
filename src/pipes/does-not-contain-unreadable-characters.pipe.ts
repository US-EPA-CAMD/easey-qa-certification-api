import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function DoesNotContainUnreadableCharacters(
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'doesNotContainUnreadableCharacters',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return !/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains unreadable characters.`;
        },
      },
    });
  };
}

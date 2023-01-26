import {
  buildMessage,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsNotEmpty(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmpty',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value, args) => isNotEmpty(value),
        defaultMessage: buildMessage(
          eachPrefix =>
            eachPrefix + 'You did not provide [$property], which is required.',
        ),
      },
    });
  };
}

function isNotEmpty(value) {
  return value !== '' && value !== null && value !== undefined;
}

/**
 * Options used to pass to validation decorators.
 */
export interface ValidationOptions {
  /**
   * Specifies if validated value is an array and each of its items must be validated.
   */
  each?: boolean;
  /**
   * Error message to be used on validation fail.
   * Message can be either string or a function that returns a string.
   */
  message?:
    | string
    | string[]
    | ((validationArguments: ValidationArguments) => string | string[]);
  /**
   * Validation groups used for this validation.
   */
  groups?: string[];
  /**
   * Indicates if validation must be performed always, no matter of validation groups used.
   */
  always?: boolean;
  context?: any;
}
export declare function isValidationOptions(val: any): val is ValidationOptions;

export interface ValidationDecoratorOptions {
  /**
   * Target object to be validated.
   */
  target: Function;
  /**
   * Target object's property name to be validated.
   */
  propertyName: string;
  /**
   * Name of the validation that is being registered.
   */
  name?: string;
  /**
   * Indicates if this decorator will perform async validation.
   */
  async?: boolean;
  /**
   * Validator options.
   */
  options?: ValidationOptions;
  /**
   * Array of validation constraints.
   */
  constraints?: any[];
  /**
   * Validator that performs validation.
   */
  validator: ValidatorConstraintInterface | Function;
}
/**
 * Registers a custom validation decorator.
 */
export declare function registerDecorator(
  options: ValidationDecoratorOptions,
): void;

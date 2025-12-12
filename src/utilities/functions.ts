import { HttpStatus } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

export function deepEquals<T>(a: T, b: T): boolean {
  // Same reference or primitive equality
  if (a === b) return true;

  // If either is null or undefined (but not both, since === above caught that)
  if (a == null || b == null) return false;

  // Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle arrays and objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    // Different number of keys
    if (keysA.length !== keysB.length) return false;

    // Check each key recursively
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        return false;
      }
      if (!deepEquals(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }

  // All other cases
  return false;
}

export function throwIfErrors(
  errorList: string[],
  { asArray = false, isImport = false } = {},
) {
  if (!isImport && errorList.length > 0) {
    throw new EaseyException(
      new Error(asArray ? JSON.stringify(errorList) : errorList.join('\n')),
      HttpStatus.BAD_REQUEST,
      { responseObject: errorList },
    );
  }
}

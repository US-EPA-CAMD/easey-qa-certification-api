import { HttpStatus } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

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

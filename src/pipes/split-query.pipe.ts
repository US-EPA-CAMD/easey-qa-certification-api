import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SplitQueryPipe implements PipeTransform {
  transform(value: string) {
    if (!value) return [];
    return value.split('|').map(item => item.trim()); // Trims whitespace
  }
}

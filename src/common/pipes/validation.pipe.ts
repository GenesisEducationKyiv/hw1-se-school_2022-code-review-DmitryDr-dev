import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const classToValidate = plainToClass(metadata.metatype, value);
    const errors = await validate(classToValidate);

    if (errors.length) {
      const description = errors.map(
        (error: ValidationError) =>
          `[${error.property}] - ${Object.values(error.constraints).join(
            ', ',
          )}`,
      );

      throw new BadRequestException(description);
    }

    return value;
  }
}

import { ZodSchema } from "zod";
import { ArgumentMetadata } from "../../core/types";
import { PipeTransform } from "../../core/decorators";

export class ZodValidationPipe implements PipeTransform<any, any> {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, meta: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (err) {
      throw new Error(
        `Validation failed for ${meta.type}${
          meta.data ? ` (${meta.data})` : ""
        }`
      );
    }
  }
}

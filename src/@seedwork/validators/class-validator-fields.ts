import { validateSync } from "class-validator";
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from "./validator-fields.interface";

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = null;
  validatedData: PropsValidated = null;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (!errors.length) {
      this.validatedData = data;
      this.errors = null;
      return true;
    }

    this.errors = errors.reduce((acc, error) => {
      const { property, constraints } = error;
      acc[property] = Object.values(constraints);
      return acc;
    }, {} as FieldsErrors);

    return false;
  }
}

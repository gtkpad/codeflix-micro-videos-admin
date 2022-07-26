import { ValidatorRules } from "../../../@seedwork/domain/validators/validator-rules";
import { Entity } from "../../../@seedwork/domain/entity/entity";
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { CategoryValidatorFactory } from "../validators/category.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";

export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export class Category extends Entity<CategoryProperties> {
  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
    super(props, id);

    this.props.name = props.name;
    this.props.description = this.props.description ?? null;
    this.props.is_active = this.props.is_active ?? true;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  public update(props: Pick<CategoryProperties, "name" | "description">) {
    this.name = props.name;
    this.description = props.description;
  }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get description(): string {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  public activate() {
    this.is_active = true;
  }

  public deactivate() {
    this.is_active = false;
  }
}

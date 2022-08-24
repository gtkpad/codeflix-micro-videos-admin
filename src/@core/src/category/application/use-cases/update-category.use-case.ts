import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dtos/category-output";
import { UseCaseInterface } from "../../../@seedwork/application/use-case.interface";

export namespace UpdateCategoryUseCase {
  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository
    ) {}

    public async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);

      entity.update({
        name: input.name,
        description: input.description,
      });

      if (input.is_active === true) entity.activate();
      if (input.is_active === false) entity.deactivate();

      await this.categoryRepository.update(entity);

      return CategoryOutputMapper.toOutput(entity);
    }
  }
}

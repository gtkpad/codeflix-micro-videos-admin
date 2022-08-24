import { CategoryRepository } from "../../domain/repository/category.repository";
import { Category } from "../../domain/entities/category";
import { CategoryOutput, CategoryOutputMapper } from "../dtos/category-output";
import { UseCaseInterface } from "../../../@seedwork/application/use-case.interface";

export namespace CreateCategoryUseCase {
  export type Input = {
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
      const entity = new Category(input);
      await this.categoryRepository.insert(entity);

      return CategoryOutputMapper.toOutput(entity);
    }
  }
}

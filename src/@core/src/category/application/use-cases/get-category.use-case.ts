import { UseCaseInterface } from "../../../@seedwork/application/use-case.interface";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dtos/category-output";

export namespace GetCategoryUseCase {
  export type Input = {
    id: string;
  };

  type Output = CategoryOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository
    ) {}

    public async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);

      return CategoryOutputMapper.toOutput(entity);
    }
  }
}

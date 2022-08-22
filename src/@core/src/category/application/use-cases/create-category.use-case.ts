import { CategoryRepository } from "../../domain/repository/category.repository";
import { Category } from "../../domain/entities/category";
import { CategoryOutput, CategoryOutputMapper } from "../dtos/category-output";
import { UseCase } from "../../../@seedwork/application/use-case.interface";

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutput;

export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  public async execute(input: Input): Promise<Output> {
    const entity = new Category(input);
    await this.categoryRepository.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
}

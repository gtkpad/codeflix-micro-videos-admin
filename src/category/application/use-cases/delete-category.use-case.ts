import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dtos/category-output";
import { UseCase } from "../../../@seedwork/application/use-case.interface";

export type Input = {
  id: string;
};

export type Output = void;

export class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  public async execute(input: Input): Promise<Output> {
    await this.categoryRepository.delete(input.id);
  }
}

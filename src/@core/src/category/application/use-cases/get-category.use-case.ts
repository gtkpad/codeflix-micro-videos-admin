import { UseCase } from "../../../@seedwork/application/use-case.interface";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dtos/category-output";

export type Input = {
  id: string;
};

type Output = CategoryOutput;

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  public async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);

    return CategoryOutputMapper.toOutput(entity);
  }
}

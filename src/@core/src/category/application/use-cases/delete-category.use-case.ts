import { CategoryRepository } from "../../domain/repository/category.repository";
import { UseCaseInterface } from "../../../@seedwork/application/use-case.interface";

export namespace DeleteCategoryUseCase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository
    ) {}

    public async execute(input: Input): Promise<Output> {
      await this.categoryRepository.delete(input.id);
    }
  }
}

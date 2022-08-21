import { UseCase } from "../../../@seedwork/application/use-case.interface";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dtos/category-output";
import { SearchInput } from "../../../@seedwork/application/dtos/search-input";
import {
  PaginationOutput,
  PaginationOutputMapper,
} from "../../../@seedwork/application/dtos/pagination-output";

export type Input = SearchInput;

type Output = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  public async execute(input: Input): Promise<Output> {
    const searchParams = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepository.search(searchParams);

    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategoryRepository.SearchResult): Output {
    return {
      ...PaginationOutputMapper.toOutput(searchResult),
      items: searchResult.items.map((item) =>
        CategoryOutputMapper.toOutput(item)
      ),
    };
  }
}

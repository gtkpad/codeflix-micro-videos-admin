import { UseCase } from "../../../@seedwork/application/use-case.interface";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput } from "../category-output.dto";
import { SearchInput } from "@seedwork/application/dtos/search-input.dto";
import { PaginationOutput } from "@seedwork/application/dtos/pagination-output.dto";

export type Input = SearchInput;

type Output = PaginationOutput<CategoryOutput>;

export class ListCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  public async execute(input: Input): Promise<Output> {
    const searchParams = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepository.search(searchParams);

    return {
      current_page: searchResult.current_page,
      last_page: searchResult.last_page,
      items: searchResult.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        is_active: item.is_active,
        created_at: item.created_at,
      })),
      per_page: searchResult.per_page,
      total: searchResult.total,
    };
  }
}

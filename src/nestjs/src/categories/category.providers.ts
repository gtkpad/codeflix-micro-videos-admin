import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import { CategoryInMemoryRepository } from '@codeflix/micro-videos/category/infra';

export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY_REPOSITORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };
  }

  export namespace USE_CASES {
    export const CREATE_CATEGORY_USE_CASE = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new CreateCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };

    export const LIST_CATEGORY_USE_CASE = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new ListCategoriesUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };

    export const UPDATE_CATEGORY_USE_CASE = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new UpdateCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };

    export const GET_CATEGORY_USE_CASE = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new GetCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };

    export const DELETE_CATEGORY_USE_CASE = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new DeleteCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
    };
  }
}

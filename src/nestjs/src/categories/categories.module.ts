import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import { CategoryInMemoryRepository } from '@codeflix/micro-videos/category/infra';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    },
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new CreateCategoryUseCase.UseCase(categoryRepo),
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new ListCategoriesUseCase.UseCase(categoryRepo),
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new UpdateCategoryUseCase.UseCase(categoryRepo),
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new GetCategoryUseCase.UseCase(categoryRepo),
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo) =>
        new DeleteCategoryUseCase.UseCase(categoryRepo),
      inject: ['CategoryInMemoryRepository'],
    },
  ],
})
export class CategoriesModule {}

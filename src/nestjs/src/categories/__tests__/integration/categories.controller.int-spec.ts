import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../../categories/categories.controller';
import { CategoriesModule } from '../../../categories/categories.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import { CategoryRepository } from '@codeflix/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../../categories/category.providers';
import { CategorySequelize } from '@codeflix/micro-videos/category/infra';
import { NotFoundError } from '@codeflix/micro-videos/@seedwork/domain';
import { CategoryPresenter } from '../../presenter/category.presenter';

describe('[INTEGRATION] CategoriesController', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
  });

  describe('should create a category', () => {
    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: null,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: false,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const presenter = await controller.create(request);

        expect(presenter.name).toBe(expectedPresenter.name);
        expect(presenter.description).toBe(expectedPresenter.description);
        expect(presenter.is_active).toBe(expectedPresenter.is_active);

        const entity = await repository.findById(presenter.id);
        expect(entity.toJSON()).toMatchObject(presenter);
      },
    );
  });

  describe('should update a category', () => {
    let category: CategorySequelize.CategoryModel;

    beforeEach(async () => {
      category = await CategorySequelize.CategoryModel.factory().create();
    });

    const arrange = [
      {
        categoryProps: {
          name: 'Category Test',
        },
        request: {
          name: 'Movie',
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        categoryProps: {
          name: 'Category Test',
        },
        request: {
          name: 'Movie',
          description: null,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        categoryProps: {
          name: 'Category Test',
        },
        request: {
          name: 'Movie',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        categoryProps: {
          name: 'Category Test',
        },
        request: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: true,
        },
      },
      {
        categoryProps: {
          name: 'Category Test',
          is_active: false,
        },
        request: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: true,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: true,
        },
      },
      {
        categoryProps: {
          name: 'Category Test',
        },
        request: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: false,
        },
        expectedPresenter: {
          name: 'Movie',
          description: 'Movie Description',
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, categoryProps, expectedPresenter }) => {
        await category.update(categoryProps);

        const presenter = await controller.update(category.id, request);

        expect(presenter.name).toBe(expectedPresenter.name);
        expect(presenter.description).toBe(expectedPresenter.description);
        expect(presenter.is_active).toBe(expectedPresenter.is_active);

        const entity = await repository.findById(presenter.id);
        expect(entity.toJSON()).toMatchObject(presenter);
      },
    );
  });

  it('should delete a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create();
    const response = await controller.remove(category.id);
    expect(response).not.toBeDefined();

    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create();
    const presenter = await controller.findOne(category.id);

    expect(presenter.id).toBe(category.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.is_active).toBe(category.is_active);
    expect(presenter.created_at.toISOString()).toBe(
      category.created_at.toISOString(),
    );
  });
});

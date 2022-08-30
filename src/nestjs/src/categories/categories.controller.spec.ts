import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
} from '@codeflix/micro-videos/category/application';
import { SortDirection } from '@codeflix/micro-videos/dist/@seedwork/domain/repository/repository-contracts';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const expectedOutput: CreateCategoryUseCase.Output = {
      id: '08b1c1ab-b817-4f7d-9ced-36c87c724d05',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const output = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should update a category', async () => {
    const id = '08b1c1ab-b817-4f7d-9ced-36c87c724d05';
    const expectedOutput: CreateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['updateUseCase'] = mockUpdateUseCase;

    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const output = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      ...input,
      id,
    });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should delete a category', async () => {
    const expectedOutput = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['deleteUseCase'] = mockDeleteUseCase;

    const id = '08b1c1ab-b817-4f7d-9ced-36c87c724d05';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should gets a category', async () => {
    const id = '08b1c1ab-b817-4f7d-9ced-36c87c724d05';

    const expectedOutput: GetCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['getUseCase'] = mockGetUseCase;

    expect(controller.findOne(id)).toBeInstanceOf(Promise);
    const output = await controller.findOne(id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should list categories', async () => {
    const expectedOutput: ListCategoriesUseCase.Output = {
      items: [
        {
          id: '08b1c1ab-b817-4f7d-9ced-36c87c724d05',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['listUseCase'] = mockListUseCase;

    const searchParams = {
      page: 1,
      per_page: 1,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };

    const output = await controller.search(searchParams);

    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(output).toStrictEqual(expectedOutput);
  });
});

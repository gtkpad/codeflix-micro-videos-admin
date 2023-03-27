import { Category } from '#category/domain';
import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CategorySequelize } from './category-sequelize';

describe('[UNIT] CategoryModelMapper', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  it('should throws error when category is invalid', () => {
    const model = CategorySequelize.CategoryModel.build({
      id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
    });
    try {
      CategorySequelize.CategoryModelMapper.toEntity(model);
      fail('The category is valid, but it need throws a LoadEntityError');
    } catch (error) {
      expect(error).toBeInstanceOf(LoadEntityError);
      expect(error.error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });
    }
  });

  it('should throw a generic error', () => {
    const error = new Error('Generic error');
    const spyValidate = jest
      .spyOn(Category, 'validate')
      .mockImplementationOnce(() => {
        throw new Error('Generic error');
      });

    const model = CategorySequelize.CategoryModel.build({
      id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
    });
    expect(() => CategorySequelize.CategoryModelMapper.toEntity(model)).toThrow(
      error,
    );
    expect(spyValidate).toHaveBeenCalled();
  });

  it('should convert a category model to a category entity', () => {
    const created_at = new Date();
    const model = CategorySequelize.CategoryModel.build({
      id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
      name: 'some value',
      description: 'some description',
      is_active: true,
      created_at,
    });

    const entity = CategorySequelize.CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: 'some value',
          description: 'some description',
          is_active: true,
          created_at,
        },
        new UniqueEntityId('df96eac1-52c9-4000-833b-e0de54d8c096'),
      ).toJSON(),
    );
  });
});

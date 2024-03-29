import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { DataType, Sequelize } from 'sequelize-typescript';
import { CategorySequelize } from './category-sequelize';

describe('[UNIT] CategoryModel', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  test('mapping props', () => {
    const attributesMap = CategorySequelize.CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    expect(attributes).toStrictEqual([
      'id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);

    const idAttr = attributesMap.id;
    expect(idAttr).toMatchObject({
      field: 'id',
      fieldName: 'id',
      type: DataType.UUID(),
      primaryKey: true,
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      type: DataType.STRING(255),
      allowNull: false,
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      type: DataType.TEXT(),
      allowNull: true,
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      type: DataType.BOOLEAN(),
      allowNull: false,
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      type: DataType.DATE(),
      allowNull: false,
    });
  });

  test('create', async () => {
    const arrange = {
      id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
      name: 'Category 1',
      description: 'Category description',
      is_active: true,
      created_at: new Date(),
    };
    const category = await CategorySequelize.CategoryModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});

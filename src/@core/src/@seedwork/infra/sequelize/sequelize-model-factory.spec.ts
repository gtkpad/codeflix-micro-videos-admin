import {
  Model,
  Table,
  Column,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from './sequelize-model-factory';
import Chance from 'chance';
const chance = Chance();
import { validate as uuidValidate } from 'uuid';
import { setupSequelize } from '../testing/helpers/db';

@Table
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory(): SequelizeModelFactory<
    StubModel,
    { id: string; name: string }
  > {
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory,
    );
  }
}

describe('SequelizeModelFactory Unit Tests', () => {
  setupSequelize({ models: [StubModel] });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('create method', async () => {
    // with factory
    let model = await StubModel.factory().create();
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();

    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toEqual(modelFound.id);

    // with data
    model = await StubModel.factory().create({
      id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
      name: 'test',
    });
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(model.id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096');
    expect(model.name).toBe('test');

    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toEqual(modelFound.id);
  });

  test('make method', async () => {
    // with factory
    let model = StubModel.factory().make();
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();

    // with data
    model = StubModel.factory().make({
      id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
      name: 'test',
    });
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(model.id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096');
    expect(model.name).toBe('test');
  });

  test('bulkCreate method using count = 1', async () => {
    // with factory
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(uuidValidate(models[0].id)).not.toBeNull();
    expect(models[0].name).not.toBeNull();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound.id);
    expect(models[0].name).toEqual(modelFound.name);

    // with data
    models = await StubModel.factory().bulkCreate((index) => ({
      id: `df96eac1-52c9-4000-833b-e0de54d8c096-${index}`,
      name: `test-${index}`,
    }));

    expect(models).toHaveLength(1);
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(models[0].id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096-0');
    expect(models[0].name).toBe('test-0');

    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound.id);
    expect(models[0].name).toEqual(modelFound.name);
  });

  test('bulkCreate method using count > 1', async () => {
    // with factory
    let models = await StubModel.factory().count(2).bulkCreate();
    expect(models).toHaveLength(2);
    expect(StubModel.mockFactory).toBeCalledTimes(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(uuidValidate(models[1].id)).toBeTruthy();
    expect(models[1].name).not.toBeNull();

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound1.id);
    expect(models[0].name).toEqual(modelFound1.name);

    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[1].id).toEqual(modelFound2.id);
    expect(models[1].name).toEqual(modelFound2.name);

    // with data
    models = await StubModel.factory()
      .count(2)
      .bulkCreate((index) => ({
        id: `df96eac1-52c9-4000-833b-e0de54d8c096-${index}`,
        name: `test-${index}`,
      }));

    expect(models).toHaveLength(2);
    expect(StubModel.mockFactory).toBeCalledTimes(2);
    expect(models[0].id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096-0');
    expect(models[0].name).toBe('test-0');
    expect(models[1].id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096-1');
    expect(models[1].name).toBe('test-1');

    modelFound1 = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound1.id);
    expect(models[0].name).toEqual(modelFound1.name);

    modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[1].id).toEqual(modelFound2.id);
    expect(models[1].name).toEqual(modelFound2.name);
  });

  test('bulkMake method using count = 1', async () => {
    // with factory
    let models = StubModel.factory().bulkMake();
    expect(models).toHaveLength(1);
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(uuidValidate(models[0].id)).not.toBeNull();
    expect(models[0].name).not.toBeNull();

    let modelsFound = await StubModel.findAll();
    expect(modelsFound).toHaveLength(0);

    // with data
    models = StubModel.factory().bulkMake((index) => ({
      id: `df96eac1-52c9-4000-833b-e0de54d8c096-${index}`,
      name: `test-${index}`,
    }));

    expect(models).toHaveLength(1);
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    expect(models[0].id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096-0');
    expect(models[0].name).toBe('test-0');

    modelsFound = await StubModel.findAll();
    expect(modelsFound).toHaveLength(0);
  });

  test('bulkMake method using count > 1', async () => {
    // with factory
    let models = StubModel.factory().count(2).bulkMake();
    expect(models).toHaveLength(2);
    expect(StubModel.mockFactory).toBeCalledTimes(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(uuidValidate(models[1].id)).toBeTruthy();
    expect(models[1].name).not.toBeNull();

    let modelsFound = await StubModel.findAll();
    expect(modelsFound).toHaveLength(0);

    // with data
    models = StubModel.factory()
      .count(2)
      .bulkMake((index) => ({
        id: `df96eac1-52c9-4000-833b-e0de54d8c096-${index}`,
        name: `test-${index}`,
      }));

    expect(models).toHaveLength(2);
    expect(StubModel.mockFactory).toBeCalledTimes(2);
    expect(models[0].id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096-0');
    expect(models[0].name).toBe('test-0');
    expect(models[1].id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096-1');
    expect(models[1].name).toBe('test-1');

    modelsFound = await StubModel.findAll();
    expect(modelsFound).toHaveLength(0);
  });
});

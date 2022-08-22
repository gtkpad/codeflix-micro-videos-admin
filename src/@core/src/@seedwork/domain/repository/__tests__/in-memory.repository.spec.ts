import { NotFoundError } from "../../errors/not-found.error";
import { Entity } from "../../entity/entity";
import { InMemoryRepository } from "../in-memory.repository";
import { UniqueEntityId } from "../../value-objects/unique-entity-id.vo";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("[UNIT]: InMemoryRepository", () => {
  let repository: StubInMemoryRepository;
  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });
  it("should inserts a new entity", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.insert(entity);

    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throws error when entity not found", async () => {
    expect(repository.findById("fake-id")).rejects.toThrow(
      new NotFoundError("Entity with id fake-id not found")
    );

    expect(
      repository.findById(
        new UniqueEntityId("37a49722-e7fb-4508-8fdb-168a431975f0")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity with id 37a49722-e7fb-4508-8fdb-168a431975f0 not found"
      )
    );
  });

  it("should finds a entity by id", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.insert(entity);

    let foundEntity = await repository.findById(entity.id);

    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());

    foundEntity = await repository.findById(entity.uniqueEntityId);

    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should returns all entities", async () => {
    const entity1 = new StubEntity({ name: "test 1", price: 1 });
    const entity2 = new StubEntity({ name: "test 2", price: 2 });
    await repository.insert(entity1);
    await repository.insert(entity2);

    const foundEntities = await repository.findAll();

    expect(foundEntities.length).toBe(2);
    expect(foundEntities).toStrictEqual([entity1, entity2]);
  });

  it("should throw error on update when entity nor found", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity with id ${entity.id} not found`)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.insert(entity);

    const updatedEntity = new StubEntity(
      {
        name: "test",
        price: 2,
      },
      entity.uniqueEntityId
    );
    await repository.update(updatedEntity);

    expect(updatedEntity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throw error on delete when entity nor found", async () => {
    expect(repository.delete("fake-id")).rejects.toThrow(
      new NotFoundError(`Entity with id fake-id not found`)
    );

    expect(
      repository.delete(
        new UniqueEntityId("37a49722-e7fb-4508-8fdb-168a431975f0")
      )
    ).rejects.toThrow(
      new NotFoundError(
        "Entity with id 37a49722-e7fb-4508-8fdb-168a431975f0 not found"
      )
    );
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});

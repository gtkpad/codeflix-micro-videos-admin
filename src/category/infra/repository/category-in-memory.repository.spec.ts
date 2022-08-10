import { Category } from "../../domain/entities/category";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe("[UNIT]: CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;
  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it("should sort by name", async () => {
    const items = [
      new Category({
        name: "c",
      }),
      new Category({
        name: "1",
      }),
      new Category({
        name: "d",
      }),
      new Category({
        name: "a",
      }),
    ];

    repository.items = items;

    const filteredItems = await repository["applySort"](items, "name", "asc");

    expect(filteredItems).toStrictEqual([
      items[1],
      items[3],
      items[0],
      items[2],
    ]);
  });

  it('should sort by "created_at" in descending order by default', async () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const items = [
      new Category({
        name: "test1",
        created_at: nextWeek,
      }),
      new Category({
        name: "test2",
        created_at: today,
      }),
      new Category({
        name: "test3",
        created_at: yesterday,
      }),
      new Category({
        name: "test220",
        created_at: tomorrow,
      }),
    ];

    repository.items = items;

    const filteredItems = await repository["applySort"](items, null, null);

    expect(filteredItems).toStrictEqual([
      items[0],
      items[3],
      items[1],
      items[2],
    ]);
  });

  it("should no filter without filter param", async () => {
    const items = [
      new Category({
        name: "test1",
      }),
      new Category({
        name: "test2",
      }),
      new Category({
        name: "test3",
      }),
      new Category({
        name: "test220",
      }),
    ];

    repository.items = items;
    const spyFilter = jest.spyOn(items, "filter");

    const filteredItems = await repository["applyFilter"](items, null);

    expect(filteredItems).toStrictEqual(items);
    expect(spyFilter).not.toHaveBeenCalled();
  });

  it("should be able to filter with filter param", async () => {
    const filter = "test2";
    const items = [
      new Category({
        name: "test1",
      }),
      new Category({
        name: "test2",
      }),
      new Category({
        name: "test3",
      }),
      new Category({
        name: "test220",
      }),
    ];

    repository.items = items;

    const filteredItems = await repository["applyFilter"](items, filter);
    expect(filteredItems.length).toBe(2);
    expect(filteredItems).toStrictEqual([items[1], items[3]]);
  });
});

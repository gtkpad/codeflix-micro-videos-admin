import { Category } from "../../../domain/entities/category";
import { CategoryRepository } from "../../../domain/repository/category.repository";
import { CategoryInMemoryRepository } from "../../../infra/repository/category-in-memory.repository";
import { ListCategoriesUseCase } from "../list-categories.use-case";

describe("[UNIT] ListCategoriesUseCase", () => {
  let useCase: ListCategoriesUseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase(categoryRepository);
  });

  test("toOutput", () => {
    let searchResult = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    let output = useCase["toOutput"](searchResult);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = new Category({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
    });
    searchResult = new CategoryRepository.SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    output = useCase["toOutput"](searchResult);

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it("should returns output using empty input with categories ordered by created_at", async () => {
    const items = [
      new Category({
        name: "Category 1",
        description: "Category 1 description",
        is_active: true,
      }),
      new Category({
        name: "Category 2",
        description: "Category 2 description",
        is_active: true,
        created_at: new Date(Date.now() + 1000),
      }),
    ];

    categoryRepository.items = items;
    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[0].toJSON()],
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and filter", async () => {
    const items = [
      new Category({
        name: "a",
      }),
      new Category({
        name: "AAA",
      }),
      new Category({
        name: "AaA",
      }),
      new Category({
        name: "b",
      }),
      new Category({
        name: "c",
      }),
    ];

    categoryRepository.items = items;
    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });
});

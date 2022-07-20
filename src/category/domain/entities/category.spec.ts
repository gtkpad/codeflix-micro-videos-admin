import { Category, CategoryProperties } from "./category";
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

describe("[UNIT]: Category Tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should create a category", () => {
    const props = {
      name: "Movie",
      description: "description",
      is_active: true,
      created_at: new Date(),
    };

    const category = new Category(props);

    expect(category.props).toStrictEqual(props);
  });

  it("should create a category with only name prop", () => {
    const props = {
      name: "Movie",
    };

    const expectData = {
      name: props.name,
      description: null,
      is_active: true,
      created_at: new Date(),
    } as CategoryProperties;

    const category = new Category(props);

    expect(category.props).toStrictEqual(expectData);
  });

  it("should create a category with id", () => {
    type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
    const data: CategoryData[] = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      {
        props: { name: "Movie" },
        id: new UniqueEntityId("df96eac1-52c9-4000-833b-e0de54d8c096"),
      },
    ];

    data.forEach((item) => {
      const category = new Category(item.props, item.id);
      expect(category.id).not.toBeNull();
      expect(category.id).toBeInstanceOf(UniqueEntityId);
    });
  });

  it("should test getter of name field", () => {
    const props = {
      name: "Movie",
    };

    const category = new Category(props);

    expect(category.name).toEqual(props.name);
  });

  it("should test getter and setter of description field", () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.description).toBeNull();

    category = new Category({
      name: "Movie",
      description: "description",
    });

    expect(category.description).toEqual("description");

    category = new Category({
      name: "Movie",
    });

    category["description"] = "other description";

    expect(category.description).toEqual("other description");

    category["description"] = undefined;

    expect(category.description).toBeNull();

    category["description"] = null;

    expect(category.description).toBeNull();
  });

  it('should test getter and setter of "is_active" field', () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Movie",
      is_active: true,
    });

    expect(category.is_active).toBeTruthy();

    category["is_active"] = false;

    expect(category.is_active).toBeFalsy();

    category["is_active"] = true;

    expect(category.is_active).toBeTruthy();

    category["is_active"] = undefined;

    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Movie",
      is_active: false,
    });

    expect(category.is_active).toBeFalsy();
  });

  it('should test getter and setter of "created_at" field', () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.created_at).toBeInstanceOf(Date);
    expect(category.created_at.toISOString()).toEqual(new Date().toISOString());

    jest.useRealTimers();

    const date = new Date(2022, 1, 1);

    category = new Category({
      name: "Movie",
      created_at: date,
    });

    expect(category.created_at).toBeInstanceOf(Date);
    expect(category.created_at.toISOString()).toEqual(date.toISOString());
  });
});

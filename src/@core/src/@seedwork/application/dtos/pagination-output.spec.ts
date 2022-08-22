import { SearchResult } from "../../domain/repository/repository-contracts";
import { PaginationOutputMapper } from "./pagination-output";

describe("[UNIT]: PaginationOutputMapper", () => {
  it("should map entity to output", () => {
    const result = new SearchResult({
      current_page: 1,
      items: ["fake"] as any,
      per_page: 1,
      total: 1,
      filter: null,
      sort: null,
      sort_dir: null,
    });
    const output = PaginationOutputMapper.toOutput(result);

    expect(output).toStrictEqual({
      current_page: 1,
      per_page: 1,
      total: 1,
      last_page: 1,
    });
  });
});

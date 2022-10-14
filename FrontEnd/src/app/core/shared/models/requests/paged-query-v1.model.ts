export class PagedQueryV1Model {
  currentPage: number;
  pageSize: number;
  searchTerm?: string;
  [key: string]: any;

  constructor(query?: Partial<PagedQueryV1Model>) {
    if (query) Object.assign(this, query);
  }
}

export class PagedQueryV1Model {
  currentPage: number;
  pageSize: number;
  [key: string]: any;

  constructor(query?: Partial<PagedQueryV1Model>) {
    if (query) Object.assign(this, query);
  }
}

export interface PageQueryModel {
  page: number;
  limit: number;
}

export interface PageModel<T> {
  items: T[];
  totalCount: number;
}

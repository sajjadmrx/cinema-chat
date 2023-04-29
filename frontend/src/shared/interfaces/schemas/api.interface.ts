export interface ApiResponse<D> {
  readonly statusCode: number
  readonly data: D
}

export interface ReturnFormat<T> {
  data: T
}
export interface Pagination {
  totalDoc: number
  totalPages: number
  nextPage: number
}

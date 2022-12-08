export interface Pagination
{
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export class PaginatedResult<T>
{
    result!: T;
    pagination!: Pagination;
}
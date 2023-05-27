import { ResourceDetail } from './resource';

export interface ApiResponse<T> {
  statusCode: number;
  statusMessage: string;
  timeTook: number;
  data: T;
  errors?: any;
}

export interface DataListResponse<T> {
  content: T;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export class CustomError {
  errors!: ErrorData;
  constructor(error: any) {
    this.errors = error[0];
  }
}

export class ErrorData {
  error!: {
    errorCode: string;
    errorMessage: string;
  };
}

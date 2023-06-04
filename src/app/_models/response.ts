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
  errorCode!: string;
  errorMessage!: string;
  fieldError?: string;
  constructor(error: any) {
    this.errorCode = error[0].errorCode;
    this.errorMessage = error[0].errorMessage;
    this.fieldError = error[0].fieldError ?? '';
  }
}

export class ErrorData {
  error!: {
    errorCode: string;
    errorMessage: string;
    errorField?: string;
  };
}

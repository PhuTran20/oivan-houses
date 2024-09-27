import { NullableString } from './nullable-string.interface';

export interface ResponseResult<T> {
  data: T[];
  meta?: MetaData | null;
}

export interface ResponseObjectResult<T> {
  data: T;
}

export interface ResponseError<T> {
  errors: ErrorDetail[];
}

interface MetaData {
  record_count: number;
}
interface ErrorSource {
  pointer: NullableString;
}

interface ErrorDetail {
  status: string;
  title: string;
  detail: string;
  code: NullableString;         
  source?: ErrorSource;
}
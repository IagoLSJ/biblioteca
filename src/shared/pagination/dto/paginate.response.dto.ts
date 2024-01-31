import { IMetadata } from './metadata.interface';

export interface PaginateResponseDTO<PaginateObject> {
  items: PaginateObject[];
  meta: IMetadata;
}

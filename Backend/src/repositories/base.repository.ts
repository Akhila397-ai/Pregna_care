import { deleteModel } from "mongoose";
import { Types } from "mongoose";

export interface IBaseRepository<T> {
  findById(id: string): Promise<(T & {_id: Types.ObjectId}) | null>
  create(data: Partial<T>): Promise<T & {_id: Types.ObjectId}>;
  update(id: string, data: Partial<T>): Promise<(T & {_id: Types.ObjectId}) | null>
  delete(id: string): Promise<void>;
}
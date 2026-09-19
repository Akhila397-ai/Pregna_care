import { Model, Types } from "mongoose";
import { injectable, unmanaged } from "inversify";
import { IBaseRepository } from "./IBase.repository.js";

@injectable()
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly model: Model<any>;

  constructor(@unmanaged() model: Model<any>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T & { _id: Types.ObjectId }> {
    const doc = await this.model.create(data);
    return doc.toObject ? (doc.toObject() as T & { _id: Types.ObjectId }) : doc;
  }

  async findById(id: string): Promise<(T & { _id: Types.ObjectId }) | null> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    return await this.model.findById(objectId).lean();
  }

  async findOne(filter: Record<string, any>): Promise<(T & { _id: Types.ObjectId }) | null> {
    return await this.model.findOne(filter).lean();
  }

  async findMany(
    filter: Record<string, any> = {},
    skip = 0,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<(T & { _id: Types.ObjectId })[]> {
    return await this.model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort as any)
      .lean();
  }

  async update(id: string, data: Record<string, any>): Promise<(T & { _id: Types.ObjectId }) | null> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    return await this.model
      .findByIdAndUpdate(objectId, data, { new: true })
      .lean();
  }

  async delete(id: string): Promise<boolean> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    const result = await this.model.findByIdAndDelete(objectId);
    return Boolean(result);
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async exists(filter: Record<string, any>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return Boolean(result);
  }
}

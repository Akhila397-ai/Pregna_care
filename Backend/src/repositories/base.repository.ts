import { Model, HydratedDocument } from "mongoose";

export class BaseRepository<T> {

  constructor(protected model: Model<T>) {}

  async findOne(filter: Partial<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter);
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    return this.model.create(data);
  }

  async update(
    id: string,
    data: Partial<T>
  ): Promise<HydratedDocument<T> | null> {

    return this.model.findByIdAndUpdate(id, data, { new: true });

  }
}
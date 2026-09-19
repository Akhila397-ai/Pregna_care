import { Model, Types } from "mongoose";
import { IBaseRepository } from "./IBase.repository.js";
export declare abstract class BaseRepository<T> implements IBaseRepository<T> {
    protected readonly model: Model<any>;
    constructor(model: Model<any>);
    create(data: Partial<T>): Promise<T & {
        _id: Types.ObjectId;
    }>;
    findById(id: string): Promise<(T & {
        _id: Types.ObjectId;
    }) | null>;
    findOne(filter: Record<string, any>): Promise<(T & {
        _id: Types.ObjectId;
    }) | null>;
    findMany(filter?: Record<string, any>, skip?: number, limit?: number, sort?: Record<string, 1 | -1>): Promise<(T & {
        _id: Types.ObjectId;
    })[]>;
    update(id: string, data: Record<string, any>): Promise<(T & {
        _id: Types.ObjectId;
    }) | null>;
    delete(id: string): Promise<boolean>;
    count(filter?: Record<string, any>): Promise<number>;
    exists(filter: Record<string, any>): Promise<boolean>;
}
//# sourceMappingURL=base.repository.d.ts.map
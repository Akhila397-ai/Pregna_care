var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Model, Types } from "mongoose";
import { injectable, unmanaged } from "inversify";
let BaseRepository = class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const doc = await this.model.create(data);
        return doc.toObject ? doc.toObject() : doc;
    }
    async findById(id) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        return await this.model.findById(objectId).lean();
    }
    async findOne(filter) {
        return await this.model.findOne(filter).lean();
    }
    async findMany(filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 }) {
        return await this.model
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .lean();
    }
    async update(id, data) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        return await this.model
            .findByIdAndUpdate(objectId, data, { new: true })
            .lean();
    }
    async delete(id) {
        const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
        const result = await this.model.findByIdAndDelete(objectId);
        return Boolean(result);
    }
    async count(filter = {}) {
        return await this.model.countDocuments(filter);
    }
    async exists(filter) {
        const result = await this.model.exists(filter);
        return Boolean(result);
    }
};
BaseRepository = __decorate([
    injectable(),
    __param(0, unmanaged()),
    __metadata("design:paramtypes", [Model])
], BaseRepository);
export { BaseRepository };
//# sourceMappingURL=base.repository.js.map
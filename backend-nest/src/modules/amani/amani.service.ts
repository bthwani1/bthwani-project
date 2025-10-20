import { Injectable, NotFoundException } from '@nestjs/common';
import type { Model } from 'mongoose';
import { Amani } from './entities/amani.entity';
import type CreateAmaniDto from './dto/create-amani.dto';
import type UpdateAmaniDto from './dto/update-amani.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AmaniService {
  constructor(@InjectModel(Amani.name) private readonly model: Model<Amani>) {} 

  async create(dto: CreateAmaniDto) {
    const doc = new this.model(dto);
    return await doc.save();
  }

  async findAll(opts: { cursor?: string }) {
    const limit = 25;
    const query = this.model.find().sort({ _id: -1 }).limit(limit);
    if (opts?.cursor) {
      query.where('_id').lt(Number(opts.cursor));
    }
    const items = await query.exec();
    const nextCursor = items.length === limit ? String(items[items.length - 1]._id) : null;
    return { items, nextCursor };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Not found');
    return doc;
  }

  async update(id: string, dto: UpdateAmaniDto) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!doc) throw new NotFoundException('Not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Not found');
    return { ok: true };
  }
}

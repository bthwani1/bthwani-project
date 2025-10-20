import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import Sanad from './entities/sanad.entity';
import type CreateSanadDto from './dto/create-sanad.dto';
import type UpdateSanadDto from './dto/update-sanad.dto';

@Injectable()
export class SanadService {
  constructor(@InjectModel(Sanad.name) private readonly model: Model<Sanad>) {} 

  async create(dto: CreateSanadDto) {
    const doc = new this.model(dto);
    return await doc.save();
  }

  async findAll(opts: { cursor?: string }) {
    const limit = 25;
    const query = this.model.find().sort({ _id: -1 }).limit(limit);
    if (opts?.cursor) {
      query.where('_id').lt(opts.cursor);
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

  async update(id: string, dto: UpdateSanadDto) {
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeaDto, Paginated, TeaListQuery, UpdateTeaDto } from './tea.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TeaService {
  private teas: any[] = [];

  findAll(q: TeaListQuery): Promise<Paginated<any>> {
    const { minRating, page, pageSize } = q;

    const filtered = typeof minRating === 'number' ?
      this.teas.filter(t => (t.rating ?? 0) >= minRating) : [...this.teas];

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return Promise.resolve({ data, total, page, pageSize });
  }

  findOne(id: string) {
    const tea = this.teas.find((t) => t.id === id);
    if (!tea) throw new NotFoundException('Tea not found');
    return Promise.resolve(tea);
  }

  create(data: CreateTeaDto) {
    const newTea = { id: uuid(), ...data };
    this.teas.push(newTea);
    return Promise.resolve(newTea);
  }

  update(id: string, data: UpdateTeaDto) {
    const tea = this.teas.find((t) => t.id === id);
    if (!tea) throw new NotFoundException('Tea not found');
    Object.assign(tea, data);
    return Promise.resolve(tea);
  }

  delete(id: string) {
    const index = this.teas.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Tea not found');
    this.teas.splice(index, 1);
    return Promise.resolve();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeaDto, UpdateTeaDto } from './tea.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TeaService {
  private teas: any[] = [];

  findAll(minRating = 1): Promise<any[]> {
    return Promise.resolve(
      this.teas.filter((t) => (t.rating ?? 0) >= minRating),
    );
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

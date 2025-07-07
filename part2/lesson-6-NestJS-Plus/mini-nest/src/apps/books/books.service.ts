import { LoggerService } from 'src/core/logger.service';
import { Injectable } from '../../core/decorators';
import { Inject } from 'src/core/decorators/inject';

export interface Book {
  id: string;
  title: string;
}

@Injectable()
export class BooksService {
  constructor(@Inject(LoggerService) private logger: LoggerService) {}
  
  #data: Book[] = [{ id: '1', title: 'book1' }];

  findAll() {
    this.logger.log('findAll called');
    return this.#data;
  }

  findOne(id: string) {
    this.logger.log('findOne called');
    return this.#data.find(b => b.id === id);
  }

  create(data: { title: string }) {
    const book = { id: Date.now().toString(), title: data.title };
    this.#data.push(book);
    return book;
  }

  delete(id: string) {
    const index = this.#data.findIndex(b => b.id === id);
    if (index === -1) return null;
    const [deleted] = this.#data.splice(index, 1);
    return deleted;
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';

export type Profile = { id: string; email: string; displayName: string; age: number };

@Injectable()
export class ProfilesService {
  private store: Profile[] = [];
  private seq = 1;

  create(dto: CreateProfileDto): Profile {
    if (this.store.some(p => p.email === dto.email)) {
      throw new ConflictException('email already exists');
    }
    const profile: Profile = { id: String(this.seq++), ...dto };
    this.store.push(profile);
    return profile;
  }

  findById(id: string): Profile {
    const p = this.store.find(p => p.id === id);
    if (!p) throw new NotFoundException('not found');
    return p;
  }

  findAll(): Profile[] {
    return this.store;
  }
}
import {
  Body, Controller, Get, Param, Post, Res,
  UploadedFile, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Store } from '../store/store';
import { UserDTO } from '../dto';
import { v4 as uuid } from 'uuid';
import { writeFileSync, existsSync, mkdirSync, createReadStream } from 'fs';
import { join } from 'path';

@Controller('/api/users')
export class UsersController {
  constructor(private store: Store) {}

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  createUser(
    @Body('name') name: string,
    @UploadedFile() icon?: Express.Multer.File,
  ): UserDTO {
    const id = uuid();
    const iconFileName = `${id}.png`;
    const iconsDir = join(process.cwd(), 'public', 'icons');

    if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

    if (icon) {
      writeFileSync(join(iconsDir, iconFileName), icon.buffer);
    }

    const user: UserDTO = {
      id,
      name,
      iconUrl: `/api/users/icons/${iconFileName}`
    };

    this.store.users.push(user);
    this.store.save();

    return user;
  }

  @Get()
  list(): { items: UserDTO[]; total: number } {
    return {
      items: this.store.users,
      total: this.store.users.length
    };
  }

  @Get('icons/:iconPath')
  async icon(@Param('iconPath') iconPath: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'public', 'icons', iconPath);
    if (existsSync(filePath)) {
      return createReadStream(filePath).pipe(res);
    }

    const fallback = join(process.cwd(), 'public', 'icons', 'default.png');
    return createReadStream(fallback).pipe(res);
  }
}

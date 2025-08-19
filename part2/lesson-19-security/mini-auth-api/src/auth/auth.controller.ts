import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: ExpressRequest) {
    const authHeader = req.header('authorization') ?? undefined;
    return this.auth.login(body, authHeader);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    return this.auth.refresh(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: ExpressRequest & { user: any }) {
    return req.user;
  }
}

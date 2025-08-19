import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, AppUser } from '../users/users.service';

type Tokens = { accessToken: string; refreshToken: string; user: any };

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  private makePayload(u: AppUser) {
    return { sub: u.id, email: u.email, roles: u.roles };
  }

  private async signTokens(u: AppUser): Promise<Tokens> {
    const payload = this.makePayload(u);

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET ?? 'access-secret',
      expiresIn: '5m',
    });

    const refreshToken = await this.jwt.signAsync(
      { ...payload, type: 'refresh' },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken, user: payload };
  }

  private parseBasic(
    header?: string,
  ): { email: string; password: string } | null {
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Basic' || !token) return null;
    const [email, password] = Buffer.from(token, 'base64')
      .toString('utf8')
      .split(':');
    return { email, password };
  }

  async login(
    body: { email?: string; password?: string },
    basicHeader?: string,
  ) {
    const creds = this.parseBasic(basicHeader) ?? {
      email: body.email!,
      password: body.password!,
    };

    if (!creds?.email || !creds?.password)
      throw new UnauthorizedException('Bad credentials');

    const user = await this.users.findByEmail(creds.email);
    if (!user || user.password !== creds.password)
      throw new UnauthorizedException('Bad credentials');

    return this.signTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const data = await this.jwt.verifyAsync<any>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
      });
      if (data?.type !== 'refresh') throw new UnauthorizedException();

      const user = await this.users.findByEmail(data.email);
      if (!user) throw new UnauthorizedException();

      const { accessToken } = await this.signTokens(user);
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

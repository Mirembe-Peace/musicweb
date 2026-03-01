import { Controller, Post, Body, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('seed')
  async seed() {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new ForbiddenException('Seed endpoint is disabled in production');
    }
    await this.authService.seedAdmin();
    return { message: 'Admin seeded if not exists' };
  }
}

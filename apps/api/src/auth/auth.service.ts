import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async seedAdmin() {
    const count = await this.userRepository.count();
    if (count === 0) {
      const email = this.configService.get<string>('ADMIN_EMAIL', 'admin@ashabamusic.com');
      const password = this.configService.get<string>('ADMIN_PASSWORD', 'admin123');
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = this.userRepository.create({ email, password: hashedPassword });
      await this.userRepository.save(admin);
      this.logger.log(`Admin account created: ${email}`);
    }
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password?: string }) {
    // Simple login endpoint for testing purposes
    // In production, you should validate credentials against a user database
    const payload = { username: loginDto.username, sub: 'test-user-id' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import { Controller, Post, Body, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: any) {
    const { email, password, firstName, lastName } = body;
    await this.authService.signUp(email, password, firstName, lastName);
    return { message: 'User created successfully' };
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: any, @Res() res: Response) {
    const { email, password } = body;
    return this.authService.signIn(email, password, res);
  }

  @Public()
  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    return this.authService.signOut(refreshToken, res);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    return this.authService.refresh(refreshToken, res);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: any) {
    // Example implementation. In real setup this emails a link.
    return { message: 'Password reset link sent' };
  }
}

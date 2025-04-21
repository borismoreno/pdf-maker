import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            return { message: 'Credenciales inválidas' };
        }
        return this.authService.login(user);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async refreshToken(@Req() req) {
        return req.user;
    }
}

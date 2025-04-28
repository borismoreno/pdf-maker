import { Body, Controller, Get, Post, Req, UseGuards, Header, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    private readonly cookieDomain = this.configService.getOrThrow('COOKIE_DOMAIN');
    private readonly cookieSecure = this.configService.getOrThrow('COOKIE_SECURE');
    private readonly cookieHttpOnly = this.configService.getOrThrow('COOKIE_HTTP_ONLY');
    private readonly cookieSameSite = this.configService.getOrThrow('COOKIE_SAME_SITE');


    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res() response: Response,
    ) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            return response.status(401).send({
                message: 'Credenciales Inválidas',
            });
        }
        const loginResponse = await this.authService.login(user);
        response.cookie('access_token', loginResponse.token, {
            httpOnly: this.cookieHttpOnly,
            secure: this.cookieSecure, // Set to true if using HTTPS
            sameSite: this.cookieSameSite,
            path: '/',
            domain: this.cookieDomain,
        });
        return response.status(200).send(loginResponse);
    }

    @Post('logout')
    async logout(
        @Res() response: Response,
    ) {
        response.clearCookie('access_token', {
            httpOnly: this.cookieHttpOnly,
            secure: this.cookieSecure, // Set to true if using HTTPS
            sameSite: this.cookieSameSite,
            domain: this.cookieDomain,
            path: '/',
        });
        return response.status(204).send();
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async refreshToken(
        @Req() req,
        @Res() response: Response,
    ) {
        const user = req.user;
        response.cookie('access_token', user.token, {
            httpOnly: this.cookieHttpOnly,
            secure: this.cookieSecure, // Set to true if using HTTPS
            // secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            sameSite: this.cookieSameSite,
            domain: this.cookieDomain,
            path: '/',
        });
        return response.status(200).send(user);
    }
}

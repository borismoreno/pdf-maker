import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { LoginResponseDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import mongoose from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey: 'SEED-PRODUCCION',
            secretOrKey: process.env.JWT_SECRET,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any): Promise<LoginResponseDto> {
        const user = await this.userService.findById(new mongoose.Types.ObjectId(payload.sub));
        if (!user) {
            return null;
        }
        return await this.authService.login(user);
    }
}
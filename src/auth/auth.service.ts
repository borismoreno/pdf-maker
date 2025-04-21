import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Usuario } from 'src/user/schemas/user.schema';
import { LoginResponseDto } from './dto/login.dto';
import { EmpresaService } from 'src/empresa/empresa.service';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly empresaService: EmpresaService,
    ) { }

    async validateUser(username: string, password: string): Promise<Usuario> {
        const user = await this.usersService.findByEmail(username);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(user: Usuario): Promise<LoginResponseDto> {
        const payload = { username: user.nombre, sub: user._id };
        const empresa = await this.empresaService.findById(new mongoose.Types.ObjectId(user.empresa));
        return {
            token: this.jwtService.sign(payload),
            user: {
                _id: '' + user._id,
                rol: user.rol,
                estado: user.estado,
                nombre: user.nombre,
                email: user.email,
                empresa: empresa.nombreComercial,
                pagoRegistrado: user.pagoRegistrado,
            },
        };
    }

    // async refreshToken(user: Usuario) {
    //     const payload = { username: user.nombre, sub: user._id };
    //     return {
    //         token: this.jwtService.sign(payload),
    //     };
    // }
}

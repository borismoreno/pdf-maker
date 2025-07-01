import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { GetEmpresaDto } from './dto/get-empresa.dto';
import mongoose from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('empresa')
export class EmpresaController {
    constructor(private readonly empresaService: EmpresaService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getEmpresaSettings(@Req() req): Promise<GetEmpresaDto> {
        const claims = req.user;
        return this.empresaService.findEmpresaSettings(new mongoose.Types.ObjectId(claims.user._id))
    }
}

import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { FacturaEmitida } from './schemas/facturaEmitida.schema';
import { AuthGuard } from '@nestjs/passport';
import { ComprobanteDto, CreateFacturaDto, SimularEmision } from './dto/create-factura.dto';
import { SearchType } from 'src/helpers/date';

@Controller('comprobante')
export class ComprobanteController {
    constructor(
        private readonly comprobanteService: ComprobanteService,
    ) { }

    @Post('factura')
    // @UseGuards(AuthGuard('jwt'))
    async saveFactura(
        // @Req() req,
        @Body() factura: ComprobanteDto
    ): Promise<void> {
        await this.comprobanteService.saveFactura(factura, '5ee051bb29c5d22658370396');
        // await this.comprobanteService.saveFactura(factura, req.user.user._id);
    }

    @Get('current-date')
    getCurrentDateLocal(): Date {
        return this.comprobanteService.getCurrentDateLocal();
    }

    @Get('facturas-emitidas')
    @UseGuards(AuthGuard('jwt'))
    async getFacturasEmitidas(
        @Req() req,
        @Query('startDate')
        startDate: string,
        @Query('endDate')
        endDate: string,
        @Query('searchType')
        searchType: SearchType
    ): Promise<any> {
        const claims = req.user;
        return this.comprobanteService.getFacturasEmitidas(claims.user.rucEmpresa, searchType, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined)
    }

    @Post('simular-emision')
    // @UseGuards(AuthGuard('jwt'))
    async simularEmision(
        // @Req() req,
        @Body() factura: SimularEmision
    ): Promise<void> {
        await this.comprobanteService.simularEmision(factura.connectionId);
        // await this.comprobanteService.saveFactura(factura, req.user.user._id);
    }

}

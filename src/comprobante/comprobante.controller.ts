import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { FacturaEmitida } from './schemas/facturaEmitida.schema';
import { AuthGuard } from '@nestjs/passport';
import { ComprobanteDto, CreateFacturaDto } from './dto/create-factura.dto';

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

}

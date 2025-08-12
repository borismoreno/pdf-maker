import { Controller, Get } from '@nestjs/common';
import { GeneralService } from './general.service';
import { IGetTarifaIvaResponse, IGetTipoFormaPagoResponse, IGetTipoIdentificacionResponse, IGetTipoProductoResponse } from './dto/get-tipo-identificacion.dto';

@Controller('general')
export class GeneralController {
    constructor(
        private readonly generalService: GeneralService
    ) { }

    @Get('tipo-identificacion')
    async getAllTipoIdentificacion(): Promise<IGetTipoIdentificacionResponse[]> {
        return this.generalService.getAllTipoIdentificacion();
    }

    @Get('tipo-producto')
    async getAllTipoProducto(): Promise<IGetTipoProductoResponse[]> {
        return this.generalService.getAllTipoProducto();
    }

    @Get('tarifa-iva')
    async getAllTarifaIva(): Promise<IGetTarifaIvaResponse[]> {
        return this.generalService.getAllTarifaIva();
    }

    @Get('tipo-formaPago')
    async getAllTipoFormaPago(): Promise<IGetTipoFormaPagoResponse[]> {
        return await this.generalService.getAllTipoFormaPago();
    }
}

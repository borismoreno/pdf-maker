import { Controller, Get } from '@nestjs/common';
import { GeneralService } from './general.service';
import { IGetTipoIdentificacionResponse } from './dto/get-tipo-identificacion.dto';

@Controller('general')
export class GeneralController {
    constructor(
        private readonly generalService: GeneralService
    ) { }

    @Get('tipo-identificacion')
    async getAllTipoIdentificacion(): Promise<IGetTipoIdentificacionResponse[]> {
        return this.generalService.getAllTipoIdentificacion();
    }
}

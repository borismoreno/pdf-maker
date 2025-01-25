import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
    constructor(private readonly reportesService: ReportesService) { }
    @Get(':claveAcceso')
    async getFactura(
        @Param('claveAcceso') claveAcceso
    ): Promise<string> {
        const pdfDoc = await this.reportesService.getFactura(claveAcceso);
        return pdfDoc;
    }

    @Get('reporteTest/:claveAcceso')
    async getFacturaTest(
        @Param('claveAcceso') claveAcceso,
        @Res() response: Response
    ) {
        const pdfDoc = await this.reportesService.getFacturaTest(claveAcceso);
        response.setHeader('Content-Type', 'application/pdf');
        pdfDoc.info.Title = 'Factura';
        pdfDoc.pipe(response);
        pdfDoc.end();
    }

    // @Get('getTest/:claveAcceso')
    // async getTest(
    //     @Param('claveAcceso') claveAcceso
    // ): Promise<string> {
    //     const pdfDoc = await this.reportesService.getTest(claveAcceso);
    //     return pdfDoc;
    // }
}

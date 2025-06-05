import { Injectable } from '@nestjs/common';
import { ComprobanteService } from 'src/comprobante/comprobante.service';
import { GetDashboardInfoDto, GetDashboardInfoResponse } from './dto/get-dashboard-info.dto';
import { getPercentage } from 'src/helpers/numeric';

@Injectable()
export class DashboardService {
    constructor(
        private readonly comprobanteService: ComprobanteService
    ) { }

    async getDashboardNumbers(ruc: string, startDate?: Date, endDate?: Date): Promise<GetDashboardInfoDto> {
        const startDatePastYear: Date = startDate ? new Date(new Date(startDate).setFullYear(startDate.getFullYear() - 1)) : undefined;
        const endDatePastYear: Date = endDate ? new Date(new Date(endDate).setFullYear(endDate.getFullYear() - 1)) : undefined;
        const response = await this.comprobanteService.getImporteTotalEmitidasCurrentMonth(ruc, false, startDate, endDate);
        const responsePastYear = await this.comprobanteService.getImporteTotalEmitidasCurrentMonth(ruc, true, startDatePastYear, endDatePastYear);
        const responseFacturasEmitidas = await this.comprobanteService.getTotalFacturasEmitidas(ruc, false, startDate, endDate);
        const responseFacturasEmitidasPastYear = await this.comprobanteService.getTotalFacturasEmitidas(ruc, true, startDatePastYear, endDatePastYear);
        const responseClientes = await this.comprobanteService.getNumeroNuevosClientesCurrentMonth(ruc, false, startDate, endDate);
        const responseClientesPastYear = await this.comprobanteService.getNumeroNuevosClientesCurrentMonth(ruc, true, startDatePastYear, endDatePastYear);
        const topFiveClients = await this.comprobanteService.getTopFiveClients(ruc, startDate, endDate);
        const percentageFacturas = getPercentage(responsePastYear, response);
        const percentageTotalFacturas = getPercentage(responseFacturasEmitidasPastYear, responseFacturasEmitidas);
        const percentageClientes = getPercentage(responseClientesPastYear, responseClientes);
        let dashboardInfo: GetDashboardInfoResponse[] = [
            {
                title: 'Total Facturado',
                value: response,
                change: `${percentageFacturas.toFixed(0)}%`,
                trend: percentageFacturas < 1 ? 'down' : 'up',
                subtitle: 'Expectativa',
                color: 'blue'
            },
            {
                title: 'Facturas',
                value: responseFacturasEmitidas,
                change: `${percentageTotalFacturas.toFixed(0)}%`,
                trend: percentageTotalFacturas < 1 ? 'down' : 'up',
                subtitle: 'Expectativa',
                color: 'green'
            },
            {
                title: 'Nuevos Clientes',
                value: responseClientes,
                change: `${percentageClientes.toFixed(0)}%`,
                trend: percentageClientes < 1 ? 'down' : 'up',
                subtitle: 'Expectativa',
                color: 'yellow'
            }
        ];

        // const totals = [{
        //     title: 'Facturas',
        //     value: response.totalFacturasMes,
        //     change: '-16%',
        //     trend: 'down',
        //     subtitle: 'Expectations',
        //     // icon: Receipt,
        //     color: 'green'
        // }]
        return {
            metrics: dashboardInfo,
            clientes: topFiveClients
        };
    }
}

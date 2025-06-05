import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ComprobanteService } from 'src/comprobante/comprobante.service';
import { ComprobanteModule } from 'src/comprobante/comprobante.module';

@Module({
    imports: [
        ComprobanteModule
    ],
    providers: [DashboardService],
    controllers: [DashboardController]
})
export class DashboardModule { }

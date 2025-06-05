import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetDashboardInfoDto } from './dto/get-dashboard-info.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('getDashboardInfo')
    @UseGuards(AuthGuard('jwt'))
    async getDashboardInfo(
        @Req() req,
        @Query('startDate')
        startDate: string,
        @Query('endDate')
        endDate: string
    ): Promise<GetDashboardInfoDto> {
        const claims = req.user;
        return this.dashboardService.getDashboardNumbers(claims.user.rucEmpresa, new Date(startDate), new Date(endDate));
    }
}

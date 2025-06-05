import { GetClientDto } from "src/cliente/dto/get-client.dto";

export class GetDashboardInfoResponse {
    title: string;
    value: number;
    change: string;
    trend: 'up' | 'down';
    subtitle: string;
    color: string;
}

export class GetDashboardInfoDto {
    metrics: GetDashboardInfoResponse[];
    clientes: GetClientDto[];
}

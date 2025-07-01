import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from './schemas/empresa.schema';
import mongoose from 'mongoose';
import { GetEmpresaDto } from './dto/get-empresa.dto';
import { UserService } from 'src/user/user.service';
import { ICreateUpdateEmpresaRequest } from './dto/create-update-request.dto';
import { IGenericResponse } from 'src/types/general';

@Injectable()
export class EmpresaService {
    constructor(
        @InjectModel('Empresa')
        private empresaModel: mongoose.Model<Empresa>,
        @Inject(forwardRef(() => UserService))
        private readonly usersService: UserService,
    ) { }

    async findById(id: mongoose.Schema.Types.ObjectId): Promise<Empresa | null> {
        const user = await this.empresaModel.findById(id).exec();
        if (!user) {
            return null;
        }
        return user;
    }

    async updateEmpresa(id: string, empresaUpdate: ICreateUpdateEmpresaRequest): Promise<IGenericResponse> {
        try {
            const empresa = await this.findEmpresa(id);
            if (!empresa) {
                throw new NotFoundException('Empresa no encontrada');
            }
            empresa.obligadoContabilidad = empresaUpdate.obligadoContabilidad;
            empresa.secuencialNotaCredito = empresaUpdate.secuencialNotaCredito;
            empresa.secuencialRetencion = empresaUpdate.secuencialRetencion;
            empresa.regimenMicroempresa = empresaUpdate.regimenMicroempresa;
            empresa.ambiente = empresaUpdate.ambiente;
            empresa.tipoEmision = empresaUpdate.tipoEmision;
            empresa.razonSocial = empresaUpdate.razonSocial;
            empresa.nombreComercial = empresaUpdate.nombreComercial;
            empresa.ruc = empresaUpdate.ruc;
            empresa.establecimiento = empresaUpdate.establecimiento;
            empresa.puntoEmision = empresaUpdate.puntoEmision;
            empresa.direccionMatriz = empresaUpdate.direccionMatriz;
            empresa.direccionEstablecimiento = empresaUpdate.direccionEstablecimiento;
            empresa.contribuyenteEspecial = empresaUpdate.contribuyenteEspecial;
            empresa.secuencialFactura = empresaUpdate.secuencialFactura;
            empresa.claveFirma = empresaUpdate.claveFirma;
            empresa.pathCertificado = empresaUpdate.pathCertificado;
            empresa.pathLogo = empresaUpdate.pathLogo;
            empresa.nombreNotificacion = empresaUpdate.nombreNotificacion;
            empresa.contribuyenteRimpe = empresaUpdate.contribuyenteRimpe ?? false;
            empresa.activo = empresaUpdate.activo ?? true;
            await empresa.save();
            return {
                success: true,
                message: 'Empresa actualizada correctamente',
            }
        } catch (error) {
            console.error('Error al actualizar la empresa:', error);
            return {
                success: false,
                message: 'Error al actualizar la empresa',
            }
        }
        // const updatedEmpresa = await this.empresaModel.findByIdAndUpdate(
        //     id,
        //     {
        //         obligadoContabilidad: empresa.obligadoContabilidad,
        //         secuencialNotaCredito: empresa.secuencialNotaCredito,
        //         secuencialRetencion: empresa.secuencialRetencion,
        //         regimenMicroempresa: empresa.regimenMicroempresa,
        //         ambiente: empresa.ambiente,
        //         tipoEmision: empresa.tipoEmision,
        //         razonSocial: empresa.razonSocial,
        //         nombreComercial: empresa.nombreComercial,
        //         ruc: empresa.ruc,
        //         establecimiento: empresa.establecimiento,
        //         puntoEmision: empresa.puntoEmision,
        //         direccionMatriz: empresa.direccionMatriz,
        //         direccionEstablecimiento: empresa.direccionEstablecimiento,
        //         contribuyenteEspecial: empresa.contribuyenteEspecial,
        //         secuencialFactura: empresa.secuencialFactura,
        //         claveFirma: empresa.claveFirma,
        //         pathCertificado: empresa.pathCertificado,
        //         pathLogo: empresa.pathLogo,
        //         nombreNotificacion: empresa.nombreNotificacion,
        //         contribuyenteRimpe: empresa.contribuyenteRimpe ?? false,
        //         activo: empresa.activo ?? true
        //     },
        //     { new: true }
        // ).exec();
        // if (!updatedEmpresa) {
        //     return null;
        // }
        // return updatedEmpresa;
    }

    async createEmpresa(empresa: ICreateUpdateEmpresaRequest): Promise<Empresa> {
        const newEmpresa = new this.empresaModel({
            obligadoContabilidad: empresa.obligadoContabilidad,
            secuencialNotaCredito: empresa.secuencialNotaCredito,
            secuencialRetencion: empresa.secuencialRetencion,
            regimenMicroempresa: empresa.regimenMicroempresa,
            ambiente: empresa.ambiente,
            tipoEmision: empresa.tipoEmision,
            razonSocial: empresa.razonSocial,
            nombreComercial: empresa.nombreComercial,
            ruc: empresa.ruc,
            establecimiento: empresa.establecimiento,
            puntoEmision: empresa.puntoEmision,
            direccionMatriz: empresa.direccionMatriz,
            direccionEstablecimiento: empresa.direccionEstablecimiento,
            contribuyenteEspecial: empresa.contribuyenteEspecial,
            secuencialFactura: empresa.secuencialFactura,
            claveFirma: empresa.claveFirma,
            pathCertificado: empresa.pathCertificado,
            pathLogo: empresa.pathLogo,
            nombreNotificacion: empresa.nombreNotificacion,
            contribuyenteRimpe: empresa.contribuyenteRimpe ?? false,
            activo: true
        });

        const result = await newEmpresa.save();
        return result;
    }

    async findEmpresaSettings(usuarioId: mongoose.Types.ObjectId): Promise<GetEmpresaDto> {
        const usuarioEmpresa = await this.usersService.findById(usuarioId);
        if (!usuarioEmpresa) {
            throw new Error('Usuario no encontrado');
        }
        const empresa = await this.empresaModel.findById(usuarioEmpresa.empresa).exec();
        if (!empresa) {
            throw new Error('Empresa no encontrada');
        }
        return {
            _id: empresa._id.toString(),
            obligadoContabilidad: empresa.obligadoContabilidad,
            activo: empresa.activo,
            razonSocial: empresa.razonSocial,
            nombreComercial: empresa.nombreComercial,
            direccionMatriz: empresa.direccionMatriz,
            direccionEstablecimiento: empresa.direccionEstablecimiento,
            contribuyenteRimpe: empresa.contribuyenteRimpe,
            ruc: empresa.ruc,
            regimenMicroempresa: empresa.regimenMicroempresa ?? false
        }
    }

    async deleteEmpresa(id: string): Promise<IGenericResponse> {
        const empresa = await this.findEmpresa(id);
        if (!empresa) {
            throw new NotFoundException('Empresa no encontrada');
        }
        try {
            await this.empresaModel.findByIdAndDelete(id);
            return {
                success: true,
                message: 'Empresa eliminada correctamente',
            };
        } catch (error) {
            console.error('Error al eliminar la empresa:', error);
            return {
                success: false,
                message: 'Error al eliminar la empresa',
            };
        }
    }

    private async findEmpresa(id: string): Promise<Empresa> {
        let empresa: Empresa | PromiseLike<Empresa>;
        try {
            empresa = await this.empresaModel.findById(id);
        } catch (error) {
            return null;
        }
        if (!empresa) {
            return null
        }
        return empresa;
    }
}

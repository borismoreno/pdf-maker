import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Res } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { AuthGuard } from '@nestjs/passport';
import { GetProductoDto } from './dto/get-producto.dto';
import mongoose from 'mongoose';
import { CreateProductoDto } from './dto/create-producto.dto';
import { Response } from 'express';
import { IGenericResponse } from 'src/types/general';

@Controller('producto')
export class ProductoController {
    constructor(
        private readonly productoService: ProductoService
    ) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllProductos(@Req() req): Promise<GetProductoDto[]> {
        const claims = req.user;
        return this.productoService.findAll(claims.user._id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async saveProducto(
        @Req() req,
        @Body() createProductoDto: CreateProductoDto
    ): Promise<IGenericResponse> {
        return this.productoService.save(createProductoDto, req.user.user._id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateProducto(
        @Param('id') id,
        @Req() req,
        @Body() updateProductoDto: CreateProductoDto
    ): Promise<IGenericResponse> {
        return this.productoService.update(updateProductoDto, id as string, req.user.user._id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteProducto(
        @Param('id') id,
        @Req() req,
    ): Promise<IGenericResponse> {
        return this.productoService.delete(id, req.user.user._id);
    }
}

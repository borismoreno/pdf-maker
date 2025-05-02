import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Res } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { AuthGuard } from '@nestjs/passport';
import { GetProductoDto } from './dto/get-producto.dto';
import mongoose from 'mongoose';
import { CreateProductoDto } from './dto/create-producto.dto';
import { Response } from 'express';

@Controller('producto')
export class ProductoController {
    constructor(
        private readonly productoService: ProductoService
    ) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllProductos(@Req() req): Promise<GetProductoDto[]> {
        const claims = req.user;
        return this.productoService.findAll(new mongoose.Types.ObjectId(claims.user._id));
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async saveProducto(
        @Req() req,
        @Body() createProductoDto: CreateProductoDto
    ): Promise<GetProductoDto> {
        return this.productoService.save(createProductoDto, req.user.user._id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateProducto(
        @Param('id') id,
        @Req() req,
        @Body() updateProductoDto: CreateProductoDto
    ): Promise<GetProductoDto> {
        return this.productoService.update(updateProductoDto, new mongoose.Types.ObjectId(id), req.user.user._id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteProducto(
        @Param('id') id,
        @Req() req,
        @Res() response: Response,
    ) {
        return response.status(204).send(this.productoService.delete(new mongoose.Types.ObjectId(id), req.user.user._id));
    }
}

import { Injectable } from '@nestjs/common';

import PdfPrinter from 'pdfmake';
import type { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';

import * as vfsFonts from 'pdfmake/build/vfs_fonts'

const fonts = {
    Roboto: {
        normal: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
        bold: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
        italics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
        bolditalics: Buffer.from(
            vfsFonts.pdfMake.vfs['Roboto-MediumItalic.ttf'],
            'base64'
        ),
    }
}

@Injectable()
export class PrinterService {
    private printer = new PdfPrinter(fonts);

    createPdf(
        docDefinition: TDocumentDefinitions,
        options: BufferOptions = {}
    ): PDFKit.PDFDocument {
        return this.printer.createPdfKitDocument(docDefinition, options);
    }
}

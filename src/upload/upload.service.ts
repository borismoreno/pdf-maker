import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    constructor(private readonly configService: ConfigService) { }
    private readonly bucketRegion = this.configService.getOrThrow('AWS_S3_REGION');
    private readonly bucketKeyId = this.configService.getOrThrow('AWS_S3_BUCKET_ACCESS_KEY_ID');
    private readonly bucketSecret = this.configService.getOrThrow('AWS_S3_BUCKET_SECRET_ACCESS_KEY');
    private readonly bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    private readonly s3Client = new S3Client({
        region: this.bucketRegion,
        credentials: {
            accessKeyId: this.bucketKeyId,
            secretAccessKey: this.bucketSecret
        }
    });

    async upload(fileName: string, file: Buffer, contentType: string): Promise<string> {
        try {
            const res = await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileName,
                    ACL: 'public-read',
                    Body: file,
                    ContentType: contentType
                })
            );
            if (res.$metadata.httpStatusCode === 200) return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${fileName}`;
            return '';
        } catch (error) {
            throw new Error(error);

        }
    }

    async obtenerArchivo(key: string): Promise<string> {
        try {
            const res = await this.s3Client.send(
                new GetObjectCommand({
                    Bucket: this.bucketName,
                    Key: key
                }));
            // console.log(res.$metadata.httpStatusCode);
            if (res.$metadata.httpStatusCode === 200)
                return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${key}`;
            else return ''
        } catch (error) {
            // console.log(error);
            return ''
        }
    }
}

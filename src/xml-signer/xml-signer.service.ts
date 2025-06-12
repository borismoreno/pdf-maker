import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as forge from 'node-forge';
import { UploadService } from 'src/upload/upload.service';
import xmldom from 'xmldom';
import * as xpath from 'xpath';

@Injectable()
export class XmlSignerService {
    constructor(
        private readonly uploadService: UploadService,
        private readonly configService: ConfigService
    ) { }
    private readonly XMLDSIG_NS = 'http://www.w3.org/2000/09/xmldsig#';
    private readonly XADES_NS = 'http://uri.etsi.org/01903/v1.3.2#';
    private readonly bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    private readonly bucketRegion = this.configService.getOrThrow('AWS_S3_REGION');

    async signXmlEnhanced(
        xmlContent: string,
        p12Password: string,
        p12Name: string
    ): Promise<string> {
        // 1. Parsear el certificado P12
        const arrayBuffer = await this.getBufferFirma(`certificados/${p12Name}`);
        const buffer = Buffer.from(arrayBuffer);
        const { privateKey, certificate } = this.parseP12(buffer, p12Password);
        const certificateX509_pem = forge.pki.certificateToPem(certificate);
        let certificateX509 = certificateX509_pem;
        certificateX509 = certificateX509.substring(certificateX509.indexOf('\n'));
        certificateX509 = certificateX509.substring(0, certificateX509.indexOf('\n-----END CERTIFICATE-----'));
        certificateX509 = certificateX509.replace(/\r?\n|\r/g, '').replace(/([^\0]{76})/g, '$1\n');

        const certificateX509_asn1 = forge.pki.certificateToAsn1(certificate);
        const certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
        const certificateX509_der_hash = this.sha1_base64(certificateX509_der);

        //Serial Number
        var X509SerialNumber = this.getX509SerialNumber(certificate);

        const publicKey = privateKey as forge.pki.rsa.PrivateKey;

        const exponent = this.hexToBase64(publicKey.e.data[0].toString(16));
        const modulus = this.bigint2base64(publicKey.n);

        var sha1_comprobante = this.sha1_base64Comprobante(xmlContent.replace('<?xml version="1.0" encoding="UTF-8"?>\n', ''));
        var xmlns = 'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';

        //numeros involucrados en los hash:

        var Certificate_number = this.obtenerNumeroAleatorio();

        var Signature_number = this.obtenerNumeroAleatorio();

        var SignedProperties_number = this.obtenerNumeroAleatorio();

        //numeros fuera de los hash:

        var SignedInfo_number = this.obtenerNumeroAleatorio();

        var SignedPropertiesID_number = this.obtenerNumeroAleatorio();

        var Reference_ID_number = this.obtenerNumeroAleatorio();

        var SignatureValue_number = this.obtenerNumeroAleatorio();

        var Object_number = this.obtenerNumeroAleatorio();



        var SignedProperties = '';

        SignedProperties += '<etsi:SignedProperties Id="Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">'; //SignedProperties
        SignedProperties += '<etsi:SignedSignatureProperties>';
        SignedProperties += '<etsi:SigningTime>';

        SignedProperties += new Date().toISOString();

        SignedProperties += '</etsi:SigningTime>';
        SignedProperties += '<etsi:SigningCertificate>';
        SignedProperties += '<etsi:Cert>';
        SignedProperties += '<etsi:CertDigest>';
        SignedProperties += '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedProperties += '</ds:DigestMethod>';
        SignedProperties += '<ds:DigestValue>';

        SignedProperties += certificateX509_der_hash;

        SignedProperties += '</ds:DigestValue>';
        SignedProperties += '</etsi:CertDigest>';
        SignedProperties += '<etsi:IssuerSerial>';
        SignedProperties += '<ds:X509IssuerName>';

        SignedProperties += this.getX509IssuerName(certificate);

        SignedProperties += '</ds:X509IssuerName>';
        SignedProperties += '<ds:X509SerialNumber>';

        SignedProperties += X509SerialNumber;

        SignedProperties += '</ds:X509SerialNumber>';
        SignedProperties += '</etsi:IssuerSerial>';
        SignedProperties += '</etsi:Cert>';
        SignedProperties += '</etsi:SigningCertificate>';
        SignedProperties += '</etsi:SignedSignatureProperties>';
        SignedProperties += '<etsi:SignedDataObjectProperties>';
        SignedProperties += '<etsi:DataObjectFormat ObjectReference="#Reference-ID-' + Reference_ID_number + '">';
        SignedProperties += '<etsi:Description>';

        SignedProperties += 'contenido comprobante';

        SignedProperties += '</etsi:Description>';
        SignedProperties += '<etsi:MimeType>';
        SignedProperties += 'text/xml';
        SignedProperties += '</etsi:MimeType>';
        SignedProperties += '</etsi:DataObjectFormat>';
        SignedProperties += '</etsi:SignedDataObjectProperties>';
        SignedProperties += '</etsi:SignedProperties>'; //fin SignedProperties

        const SignedProperties_para_hash = SignedProperties.replace('<etsi:SignedProperties', '<etsi:SignedProperties ' + xmlns);

        const sha1_SignedProperties = this.sha1_base64(SignedProperties_para_hash);

        let KeyInfo = '';

        KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
        KeyInfo += '\n<ds:X509Data>';
        KeyInfo += '\n<ds:X509Certificate>\n';

        //CERTIFICADO X509 CODIFICADO EN Base64 
        KeyInfo += certificateX509;

        KeyInfo += '\n</ds:X509Certificate>';
        KeyInfo += '\n</ds:X509Data>';
        KeyInfo += '\n<ds:KeyValue>';
        KeyInfo += '\n<ds:RSAKeyValue>';
        KeyInfo += '\n<ds:Modulus>\n';

        //MODULO DEL CERTIFICADO X509
        KeyInfo += modulus;

        KeyInfo += '\n</ds:Modulus>';
        KeyInfo += '\n<ds:Exponent>';

        //KeyInfo += 'AQAB';
        KeyInfo += exponent;

        KeyInfo += '</ds:Exponent>';
        KeyInfo += '\n</ds:RSAKeyValue>';
        KeyInfo += '\n</ds:KeyValue>';
        KeyInfo += '\n</ds:KeyInfo>';

        const KeyInfo_para_hash = KeyInfo.replace('<ds:KeyInfo', '<ds:KeyInfo ' + xmlns);

        const sha1_certificado = this.sha1_base64(KeyInfo_para_hash);

        let SignedInfo = '';

        SignedInfo += '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
        SignedInfo += '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
        SignedInfo += '</ds:CanonicalizationMethod>';
        SignedInfo += '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
        SignedInfo += '</ds:SignatureMethod>';
        SignedInfo += '\n<ds:Reference Id="SignedPropertiesID' + SignedPropertiesID_number + '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' + Signature_number + '-SignedProperties' + SignedProperties_number + '">';
        SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedInfo += '</ds:DigestMethod>';
        SignedInfo += '\n<ds:DigestValue>';

        //HASH O DIGEST DEL ELEMENTO <etsi:SignedProperties>';
        SignedInfo += sha1_SignedProperties;

        SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
        SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedInfo += '</ds:DigestMethod>';
        SignedInfo += '\n<ds:DigestValue>';

        //HASH O DIGEST DEL CERTIFICADO X509
        SignedInfo += sha1_certificado;

        SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n<ds:Reference Id="Reference-ID-' + Reference_ID_number + '" URI="#comprobante">';
        SignedInfo += '\n<ds:Transforms>';
        SignedInfo += '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
        SignedInfo += '</ds:Transform>';
        SignedInfo += '\n</ds:Transforms>';
        SignedInfo += '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
        SignedInfo += '</ds:DigestMethod>';
        SignedInfo += '\n<ds:DigestValue>';

        //HASH O DIGEST DE TODO EL ARCHIVO XML IDENTIFICADO POR EL id="comprobante" 
        SignedInfo += sha1_comprobante;

        SignedInfo += '</ds:DigestValue>';
        SignedInfo += '\n</ds:Reference>';
        SignedInfo += '\n</ds:SignedInfo>';

        const SignedInfo_para_firma = SignedInfo.replace('<ds:SignedInfo', '<ds:SignedInfo ' + xmlns);

        const md = forge.md.sha1.create();
        md.update(SignedInfo_para_firma, 'utf8');

        const signature = btoa(publicKey.sign(md)).match(/.{1,76}/g).join("\n");

        let xades_bes = '';

        //INICIO DE LA FIRMA DIGITAL 
        xades_bes += '<ds:Signature ' + xmlns + ' Id="Signature' + Signature_number + '">';
        xades_bes += '\n' + SignedInfo;

        xades_bes += '\n<ds:SignatureValue Id="SignatureValue' + SignatureValue_number + '">\n';

        //VALOR DE LA FIRMA (ENCRIPTADO CON LA LLAVE PRIVADA DEL CERTIFICADO DIGITAL) 
        xades_bes += signature;

        xades_bes += '\n</ds:SignatureValue>';

        xades_bes += '\n' + KeyInfo;

        xades_bes += '\n<ds:Object Id="Signature' + Signature_number + '-Object' + Object_number + '">';
        xades_bes += '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';

        //ELEMENTO <etsi:SignedProperties>';
        xades_bes += SignedProperties;

        xades_bes += '</etsi:QualifyingProperties>';
        xades_bes += '</ds:Object>';
        xades_bes += '</ds:Signature>';

        //FIN DE LA FIRMA DIGITAL 
        const firmado = xmlContent.replace(/(<[^<]+)$/, xades_bes + '$1');
        return firmado.replaceAll('\"', '"').replaceAll('\n', '');
    }

    async signXml(
        xmlContent: string,
        p12Buffer: Buffer,
        p12Password: string,
    ): Promise<string> {
        // 1. Parsear el certificado P12
        const { privateKey, certificate } = this.parseP12(p12Buffer, p12Password);

        // 2. Parsear el XML
        const doc = new xmldom.DOMParser().parseFromString(xmlContent);
        const select = xpath.useNamespaces({
            ds: this.XMLDSIG_NS,
            etsi: this.XADES_NS,
        });

        // 3. Crear la firma XAdES-BES
        const signature = this.createXadesBesSignature(doc, certificate, privateKey);

        // 4. Insertar la firma en el documento XML
        const root = select('/*', doc)[0] as Node;
        root.appendChild(signature);

        // 5. Retornar el XML firmado
        return new xmldom.XMLSerializer().serializeToString(doc);
    }

    private parseP12(p12Buffer: Buffer, password: string): {
        privateKey: forge.pki.PrivateKey;
        certificate: forge.pki.Certificate;
    } {
        try {
            const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'), false);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

            // Obtener la clave privada y el certificado
            const keyBag = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
            const certBag = p12.getBags({ bagType: forge.pki.oids.certBag });

            const index = keyBag[forge.pki.oids.pkcs8ShroudedKeyBag].length - 1;

            const privateKey = keyBag[forge.pki.oids.pkcs8ShroudedKeyBag][index].key;
            const certificate = certBag[forge.pki.oids.certBag][index].cert;

            return { privateKey, certificate };
        } catch (error) {
            throw new Error(`Error al parsear el archivo P12: ${error.message}`);
        }
    }

    private createXadesBesSignature(
        doc: Document,
        certificate: forge.pki.Certificate,
        privateKey: forge.pki.PrivateKey,
    ): Node {
        // Generar IDs únicos
        const signatureId = 'Signature' + this.obtenerNumeroAleatorio();
        const signedPropertiesId = signatureId + '-SignedProperties' + this.obtenerNumeroAleatorio();
        const referenceId = 'Reference-ID-' + this.obtenerNumeroAleatorio();
        const certificateId = 'Certificate' + this.obtenerNumeroAleatorio();
        const xmlns = 'xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';

        // 1. Crear elemento Signature
        const signatureElement = doc.createElementNS(this.XMLDSIG_NS, 'ds:Signature');
        signatureElement.setAttribute('Id', signatureId);
        signatureElement.setAttribute('xmlns:etsi', this.XADES_NS);

        // 5. Crear Object con las propiedades XAdES

        const object = doc.createElementNS(this.XMLDSIG_NS, 'ds:Object');
        const qualifyingProperties = doc.createElementNS(this.XADES_NS, 'etsi:QualifyingProperties');
        qualifyingProperties.setAttribute('Target', `#${signatureId}`);

        const signedProperties = this.createXadesObject(doc, signatureId, signedPropertiesId, referenceId, certificate);

        qualifyingProperties.appendChild(signedProperties);
        object.appendChild(qualifyingProperties);


        // 4. Crear KeyInfo
        const keyInfo = this.createKeyInfo(doc, certificate, certificateId, privateKey);

        // 2. Crear SignedInfo
        const signedPropertiesXml = new xmldom.XMLSerializer().serializeToString(signedProperties);
        const keyInfoXml = new xmldom.XMLSerializer().serializeToString(keyInfo);
        const comprobanteXml = new xmldom.XMLSerializer().serializeToString(doc);
        const signedInfo = this.createSignedInfo(
            doc,
            signatureId,
            signedPropertiesId,
            referenceId,
            certificateId,
            signedPropertiesXml.replace('<etsi:SignedProperties', '<etsi:SignedProperties ' + xmlns),
            keyInfoXml.replace('<ds:KeyInfo', '<ds:KeyInfo ' + xmlns),
            comprobanteXml.replace('<?xml version="1.0" encoding="UTF-8"?>\n', '')
        );
        signatureElement.appendChild(signedInfo);

        const signedInfoXml = new xmldom.XMLSerializer().serializeToString(signedInfo);

        const SignedInfo_para_firma = signedInfoXml.replace('<ds:SignedInfo', '<ds:SignedInfo ' + xmlns);

        const md = forge.md.sha1.create();
        md.update(SignedInfo_para_firma, 'utf8');
        const publicKey = privateKey as forge.pki.rsa.PrivateKey;

        const signature = btoa(publicKey.sign(md)).match(/.{1,76}/g).join("\n");

        // 3. Crear SignatureValue (se calculará después)
        const signatureValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:SignatureValue');
        signatureValue.setAttribute('Id', 'SignatureValue' + this.obtenerNumeroAleatorio());
        signatureValue.textContent = signature;
        signatureElement.appendChild(signatureValue);

        signatureElement.appendChild(keyInfo);

        signatureElement.appendChild(object);

        // 6. Calcular los hashes y la firma
        // this.calculateHashesAndSignature(doc, signatureElement, privateKey);

        return signatureElement;
    }

    private createSignedInfo(
        doc: Document,
        signatureId: string,
        signedPropertiesId: string,
        referenceId: string,
        certificateId: string,
        signedProperties: string,
        keyInfo: string,
        comprobanteInfo: string
    ): Node {
        const signedInfo = doc.createElementNS(this.XMLDSIG_NS, 'ds:SignedInfo');
        signedInfo.setAttribute('Id', 'Signature-SignedInfo' + this.obtenerNumeroAleatorio());

        // CanonicalizationMethod
        const canonicalizationMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:CanonicalizationMethod');
        canonicalizationMethod.setAttribute('Algorithm', 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315');
        signedInfo.appendChild(canonicalizationMethod);

        // SignatureMethod
        const signatureMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:SignatureMethod');
        signatureMethod.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#rsa-sha1');
        signedInfo.appendChild(signatureMethod);

        // Reference para SignedProperties
        const signedPropertiesRef = doc.createElementNS(this.XMLDSIG_NS, 'ds:Reference');
        signedPropertiesRef.setAttribute('Id', 'SignedPropertiesID' + this.obtenerNumeroAleatorio());
        signedPropertiesRef.setAttribute('Type', 'http://uri.etsi.org/01903#SignedProperties');
        signedPropertiesRef.setAttribute('URI', `#${signedPropertiesId}`);

        const spDigestMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestMethod');
        spDigestMethod.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
        signedPropertiesRef.appendChild(spDigestMethod);

        const spDigestValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestValue');
        spDigestValue.textContent = this.sha1_base64(signedProperties);
        signedPropertiesRef.appendChild(spDigestValue);

        signedInfo.appendChild(signedPropertiesRef);

        // Reference para el certificado
        const certRef = doc.createElementNS(this.XMLDSIG_NS, 'ds:Reference');
        certRef.setAttribute('URI', `#${certificateId}`);

        const certDigestMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestMethod');
        certDigestMethod.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
        certRef.appendChild(certDigestMethod);

        const certDigestValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestValue');
        certDigestValue.textContent = this.sha1_base64(keyInfo);
        certRef.appendChild(certDigestValue);

        signedInfo.appendChild(certRef);

        // Reference para el comprobante (documento completo)
        const comprobanteRef = doc.createElementNS(this.XMLDSIG_NS, 'ds:Reference');
        comprobanteRef.setAttribute('Id', referenceId);
        comprobanteRef.setAttribute('URI', '#comprobante');

        const transforms = doc.createElementNS(this.XMLDSIG_NS, 'ds:Transforms');
        const transform = doc.createElementNS(this.XMLDSIG_NS, 'ds:Transform');
        transform.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#enveloped-signature');
        transforms.appendChild(transform);
        comprobanteRef.appendChild(transforms);

        const compDigestMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestMethod');
        compDigestMethod.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
        comprobanteRef.appendChild(compDigestMethod);

        const compDigestValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestValue');
        compDigestValue.textContent = this.sha1_base64Comprobante(comprobanteInfo);
        comprobanteRef.appendChild(compDigestValue);

        signedInfo.appendChild(comprobanteRef);

        return signedInfo;
    }

    private createKeyInfo(
        doc: Document,
        certificate: forge.pki.Certificate,
        certificateId: string,
        privateKey: forge.pki.PrivateKey
    ): Node {
        const keyInfo = doc.createElementNS(this.XMLDSIG_NS, 'ds:KeyInfo');
        keyInfo.setAttribute('Id', certificateId);

        const x509Data = doc.createElementNS(this.XMLDSIG_NS, 'ds:X509Data');
        const x509Certificate = doc.createElementNS(this.XMLDSIG_NS, 'ds:X509Certificate');

        // Convertir certificado a Base64
        const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(certificate));
        const certB64 = forge.util.encode64(certDer.getBytes());

        x509Certificate.textContent = this.formatCertificateB64(certB64);
        x509Data.appendChild(x509Certificate);
        keyInfo.appendChild(x509Data);

        // Agregar KeyValue con módulo y exponente RSA
        const keyValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:KeyValue');
        const rsaKeyValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:RSAKeyValue');

        // Extraer módulo y exponente de la clave pública
        const publicKey = privateKey as forge.pki.rsa.PrivateKey;
        const modulus = doc.createElementNS(this.XMLDSIG_NS, 'ds:Modulus');
        modulus.textContent = forge.util.encode64(forge.util.hexToBytes(publicKey.n.toString(16)));

        const exponent = doc.createElementNS(this.XMLDSIG_NS, 'ds:Exponent');
        exponent.textContent = forge.util.encode64(forge.util.hexToBytes(publicKey.e.toString(16)));

        rsaKeyValue.appendChild(modulus);
        rsaKeyValue.appendChild(exponent);
        keyValue.appendChild(rsaKeyValue);
        keyInfo.appendChild(keyValue);

        return keyInfo;
    }

    private createXadesObject(
        doc: Document,
        signatureId: string,
        signedPropertiesId: string,
        referenceId: string,
        certificate: forge.pki.Certificate,
    ): Node {
        // const object = doc.createElementNS(this.XMLDSIG_NS, 'ds:Object');
        // const qualifyingProperties = doc.createElementNS(this.XADES_NS, 'etsi:QualifyingProperties');
        // qualifyingProperties.setAttribute('Target', `#${signatureId}`);

        const signedProperties = doc.createElementNS(this.XADES_NS, 'etsi:SignedProperties');
        signedProperties.setAttribute('Id', signedPropertiesId);

        // SignedSignatureProperties
        const signedSignatureProperties = doc.createElementNS(this.XADES_NS, 'etsi:SignedSignatureProperties');

        // SigningTime
        const signingTime = doc.createElementNS(this.XADES_NS, 'etsi:SigningTime');
        signingTime.textContent = new Date().toISOString();
        signedSignatureProperties.appendChild(signingTime);

        // SigningCertificate
        const signingCertificate = doc.createElementNS(this.XADES_NS, 'etsi:SigningCertificate');
        const cert = doc.createElementNS(this.XADES_NS, 'etsi:Cert');

        // CertDigest
        const certDigest = doc.createElementNS(this.XADES_NS, 'etsi:CertDigest');
        const digestMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestMethod');
        digestMethod.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
        certDigest.appendChild(digestMethod);

        const digestValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestValue');
        const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(certificate));
        digestValue.textContent = this.sha1_base64(certDer.getBytes());
        certDigest.appendChild(digestValue);

        cert.appendChild(certDigest);

        // IssuerSerial
        const issuerSerial = doc.createElementNS(this.XADES_NS, 'etsi:IssuerSerial');
        const issuerName = doc.createElementNS(this.XMLDSIG_NS, 'ds:X509IssuerName');
        issuerName.textContent = this.getX509IssuerName(certificate);
        issuerSerial.appendChild(issuerName);

        const serialNumber = doc.createElementNS(this.XMLDSIG_NS, 'ds:X509SerialNumber');
        serialNumber.textContent = this.getX509SerialNumber(certificate);
        issuerSerial.appendChild(serialNumber);

        cert.appendChild(issuerSerial);
        signingCertificate.appendChild(cert);
        signedSignatureProperties.appendChild(signingCertificate);
        signedProperties.appendChild(signedSignatureProperties);

        // SignedDataObjectProperties
        const signedDataObjectProperties = doc.createElementNS(this.XADES_NS, 'etsi:SignedDataObjectProperties');
        const dataObjectFormat = doc.createElementNS(this.XADES_NS, 'etsi:DataObjectFormat');
        dataObjectFormat.setAttribute('ObjectReference', `#${referenceId}`);

        const description = doc.createElementNS(this.XADES_NS, 'etsi:Description');
        description.textContent = 'contenido comprobante';
        dataObjectFormat.appendChild(description);

        const mimeType = doc.createElementNS(this.XADES_NS, 'etsi:MimeType');
        mimeType.textContent = 'text/xml';
        dataObjectFormat.appendChild(mimeType);

        signedDataObjectProperties.appendChild(dataObjectFormat);
        signedProperties.appendChild(signedDataObjectProperties);

        // qualifyingProperties.appendChild(signedProperties);
        // object.appendChild(qualifyingProperties);

        return signedProperties;
    }

    private calculateHashesAndSignature(doc: Document, signatureElement: Element, privateKey: forge.pki.PrivateKey): void {
        const select = xpath.useNamespaces({
            ds: this.XMLDSIG_NS,
            etsi: this.XADES_NS,
        });

        // 1. Calcular hash de SignedProperties
        const signedProperties = select(".//etsi:SignedProperties", signatureElement)[0] as Element;
        const signedPropertiesXml = new xmldom.XMLSerializer().serializeToString(signedProperties);
        const signedPropertiesCanonicalized = require('canonicalize')(signedPropertiesXml, {
            exclusive: true,
            comments: false,
        });
        const signedPropertiesDigest = forge.md.sha1.create().update(signedPropertiesCanonicalized).digest().toHex();
        const signedPropertiesDigestValue = select(".//ds:Reference[@Type='http://uri.etsi.org/01903#SignedProperties']/ds:DigestValue", signatureElement)[0] as Element;
        signedPropertiesDigestValue.textContent = forge.util.encode64(signedPropertiesDigest);

        // 2. Calcular hash del certificado
        const x509Certificate = select(".//ds:X509Certificate", signatureElement)[0] as Element;
        const certB64 = x509Certificate.textContent?.replace(/\s/g, '') || '';
        const certDigest = forge.md.sha1.create().update(forge.util.decode64(certB64)).digest().toHex();
        const certDigestValue = select(".//ds:Reference[@URI[contains(., 'Certificate')]]/ds:DigestValue", signatureElement)[0] as Element;
        certDigestValue.textContent = forge.util.encode64(certDigest);

        // 3. Calcular hash del comprobante (documento completo)
        const comprobante = select("//*[@id='comprobante']", doc)[0] as Element;
        const comprobanteXml = new xmldom.XMLSerializer().serializeToString(comprobante);
        const comprobanteCanonicalized = require('canonicalize')(comprobanteXml, {
            exclusive: true,
            comments: false,
        });
        const comprobanteDigest = forge.md.sha1.create().update(comprobanteCanonicalized).digest().toHex();
        const comprobanteDigestValue = select(".//ds:Reference[@URI='#comprobante']/ds:DigestValue", signatureElement)[0] as Element;
        comprobanteDigestValue.textContent = forge.util.encode64(comprobanteDigest);

        // 4. Calcular la firma del SignedInfo
        const signedInfo = select(".//ds:SignedInfo", signatureElement)[0] as Element;
        const signatureValue = select(".//ds:SignatureValue", signatureElement)[0] as Element;

        const signedInfoXml = new xmldom.XMLSerializer().serializeToString(signedInfo);
        const signedInfoCanonicalized = require('canonicalize')(signedInfoXml, {
            exclusive: true,
            comments: false,
        });

        const md = forge.md.sha1.create();
        md.update(signedInfoCanonicalized, 'utf8');
        const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
        const signature = crypto.sign('RSA-SHA1', Buffer.from(signedInfoCanonicalized, 'utf8'), {
            key: privateKeyPem,
        });
        const signatureB64 = signature.toString('base64');

        signatureValue.textContent = signatureB64;
    }

    private formatCertificateB64(certB64: string): string {
        // Formatear el certificado en líneas de 64 caracteres
        return certB64.match(/.{1,64}/g)?.join('\n') || certB64;
    }

    private getX509IssuerName(certificate: forge.pki.Certificate): string {
        // Convertir el issuer a formato X.500
        const issuerAttrs = certificate.issuer.attributes;
        const parts = [];

        for (const attr of issuerAttrs) {
            if (attr.type === '2.5.4.97') { // VAT ID
                parts.push(`${attr.type}=#${this.toHexString(String(attr.value))}`);
                break;
            }
        }

        if (certificate.issuer.getField('CN')) {
            parts.push(`CN=${certificate.issuer.getField('CN').value}`);
        }
        if (certificate.issuer.getField('L')) {
            parts.push(`L=${certificate.issuer.getField('L').value}`);
        }
        if (certificate.issuer.getField('OU')) {
            parts.push(`OU=${certificate.issuer.getField('OU').value}`);
        }
        if (certificate.issuer.getField('O')) {
            parts.push(`O=${certificate.issuer.getField('O').value}`);
        }
        if (certificate.issuer.getField('C')) {
            parts.push(`C=${certificate.issuer.getField('C').value}`);
        }

        return parts.join(',');
    }

    private getX509SerialNumber(certificate: forge.pki.Certificate): string {
        // Obtener el serial number como string decimal
        // if (typeof certificate.serialNumber === 'string') {
        //     return certificate.serialNumber;
        // }

        // Convertir de hex a decimal si es necesario
        return BigInt('0x' + certificate.serialNumber).toString();
    }

    private toHexString(str: string): string {
        // Convertir string a representación hex
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return hex;
    }

    private obtenerNumeroAleatorio(): number {
        return Math.floor(Math.random() * 999000) + 990;
    }

    private sha1_base64(txt: string): string {
        const md = forge.md.sha1.create();
        md.update(txt);
        return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
    }

    private hexToBase64(txt: string): string {
        const hex = ('00' + txt).slice(0 - txt.length - txt.length % 2);
        return btoa(String.fromCharCode.apply(null,
            hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    private bigint2base64(bigint: forge.jsbn.BigInteger): string {
        let base64 = '';
        // Convert BigInteger to a Buffer, then to base64
        let hex = bigint.toString(16);
        if (hex.length % 2) hex = '0' + hex;
        const bytes = Buffer.from(hex, 'hex');
        base64 = bytes.toString('base64');
        base64 = base64.match(/.{1,76}/g).join("\n");

        return base64;
    }

    private sha1_base64Comprobante(txt: string): string {
        const md = forge.md.sha1.create();
        md.update(txt, 'utf8');
        return Buffer.from(md.digest().toHex(), 'hex').toString('base64');
    }

    private async getBufferFirma(path: string): Promise<ArrayBuffer> {
        const file = await this.uploadService.obtenerArchivo(path);
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Error al obtener el certificado: ${response.status} ${response.statusText}`);
        }
        const DATA = await response.arrayBuffer();
        return DATA;
    }
}
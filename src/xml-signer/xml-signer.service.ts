import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as forge from 'node-forge';
import * as xmldom from 'xmldom';
import * as xpath from 'xpath';
import * as canonicalize from 'canonicalize';

@Injectable()
export class XmlSignerService {
    private readonly XMLDSIG_NS = 'http://www.w3.org/2000/09/xmldsig#';
    private readonly XADES_NS = 'http://uri.etsi.org/01903/v1.3.2#';

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

            const privateKey = keyBag[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
            const certificate = certBag[forge.pki.oids.certBag][0].cert;

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
        const signatureId = 'Signature' + crypto.randomBytes(4).toString('hex');
        const signedPropertiesId = signatureId + '-SignedProperties' + crypto.randomBytes(4).toString('hex');
        const referenceId = 'Reference-ID-' + crypto.randomBytes(4).toString('hex');
        const certificateId = 'Certificate' + crypto.randomBytes(4).toString('hex');

        // 1. Crear elemento Signature
        const signatureElement = doc.createElementNS(this.XMLDSIG_NS, 'ds:Signature');
        signatureElement.setAttribute('Id', signatureId);
        signatureElement.setAttribute('xmlns:etsi', this.XADES_NS);

        // 2. Crear SignedInfo
        const signedInfo = this.createSignedInfo(doc, signatureId, signedPropertiesId, referenceId, certificateId);
        signatureElement.appendChild(signedInfo);

        // 3. Crear SignatureValue (se calculará después)
        const signatureValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:SignatureValue');
        signatureValue.setAttribute('Id', 'SignatureValue' + crypto.randomBytes(4).toString('hex'));
        signatureElement.appendChild(signatureValue);

        // 4. Crear KeyInfo
        const keyInfo = this.createKeyInfo(doc, certificate, certificateId);
        signatureElement.appendChild(keyInfo);

        // 5. Crear Object con las propiedades XAdES
        const object = this.createXadesObject(doc, signatureId, signedPropertiesId, referenceId, certificate);
        signatureElement.appendChild(object);

        // 6. Calcular los hashes y la firma
        this.calculateHashesAndSignature(doc, signatureElement, privateKey);

        return signatureElement;
    }

    private createSignedInfo(
        doc: Document,
        signatureId: string,
        signedPropertiesId: string,
        referenceId: string,
        certificateId: string,
    ): Node {
        const signedInfo = doc.createElementNS(this.XMLDSIG_NS, 'ds:SignedInfo');
        signedInfo.setAttribute('Id', 'Signature-SignedInfo' + crypto.randomBytes(4).toString('hex'));

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
        signedPropertiesRef.setAttribute('Id', 'SignedPropertiesID' + crypto.randomBytes(4).toString('hex'));
        signedPropertiesRef.setAttribute('Type', 'http://uri.etsi.org/01903#SignedProperties');
        signedPropertiesRef.setAttribute('URI', `#${signedPropertiesId}`);

        const spDigestMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestMethod');
        spDigestMethod.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
        signedPropertiesRef.appendChild(spDigestMethod);

        const spDigestValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestValue');
        signedPropertiesRef.appendChild(spDigestValue);

        signedInfo.appendChild(signedPropertiesRef);

        // Reference para el certificado
        const certRef = doc.createElementNS(this.XMLDSIG_NS, 'ds:Reference');
        certRef.setAttribute('URI', `#${certificateId}`);

        const certDigestMethod = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestMethod');
        certDigestMethod.setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
        certRef.appendChild(certDigestMethod);

        const certDigestValue = doc.createElementNS(this.XMLDSIG_NS, 'ds:DigestValue');
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
        comprobanteRef.appendChild(compDigestValue);

        signedInfo.appendChild(comprobanteRef);

        return signedInfo;
    }

    private createKeyInfo(doc: Document, certificate: forge.pki.Certificate, certificateId: string): Node {
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

        const modulus = doc.createElementNS(this.XMLDSIG_NS, 'ds:Modulus');
        modulus.textContent = forge.util.encode64(forge.pki.publicKeyToRSAPublicKeyPem(certificate.publicKey).split('\n')[1]);

        const exponent = doc.createElementNS(this.XMLDSIG_NS, 'ds:Exponent');
        exponent.textContent = 'AQAB';

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
        const object = doc.createElementNS(this.XMLDSIG_NS, 'ds:Object');
        const qualifyingProperties = doc.createElementNS(this.XADES_NS, 'etsi:QualifyingProperties');
        qualifyingProperties.setAttribute('Target', `#${signatureId}`);

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
        const certDigestValue = forge.md.sha1.create().update(certDer.getBytes()).digest().toHex();
        digestValue.textContent = forge.util.encode64(certDigestValue);
        certDigest.appendChild(digestValue);

        cert.appendChild(certDigest);

        // IssuerSerial
        const issuerSerial = doc.createElementNS(this.XADES_NS, 'etsi:IssuerSerial');
        const issuerName = doc.createElementNS(this.XMLDSIG_NS, 'ds:X509IssuerName');
        issuerName.textContent = this.getIssuerName(certificate);
        issuerSerial.appendChild(issuerName);

        const serialNumber = doc.createElementNS(this.XMLDSIG_NS, 'ds:X509SerialNumber');
        serialNumber.textContent = certificate.serialNumber;
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

        qualifyingProperties.appendChild(signedProperties);
        object.appendChild(qualifyingProperties);

        return object;
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
        const signature = privateKey.sign(md);
        const signatureB64 = forge.util.encode64(signature);

        signatureValue.textContent = signatureB64;
    }

    private formatCertificateB64(certB64: string): string {
        // Formatear el certificado en líneas de 64 caracteres
        return certB64.match(/.{1,64}/g)?.join('\n') || certB64;
    }

    private getIssuerName(certificate: forge.pki.Certificate): string {
        // Convertir el issuer a formato string
        const issuerAttrs = certificate.issuer.attributes;
        const parts = [];

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
}
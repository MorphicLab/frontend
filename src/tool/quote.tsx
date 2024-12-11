import { bool, _void, str, u32, Enum, Struct, Vector } from "scale-ts"

interface Data<T> {
    data: Uint8Array;
}

interface Header {
    version: number;
    attestationKeyType: number;
    teeType: number;
    qeSvn: number;
    pceSvn: number;
    qeVendorId: Uint8Array;
    userData: Uint8Array;
}

interface Body {
    bodyType: number;
    size: number;
}

interface EnclaveReport {
    cpuSvn: Uint8Array;
    miscSelect: number;
    reserved1: Uint8Array;
    attributes: Uint8Array;
    mrEnclave: Uint8Array;
    reserved2: Uint8Array;
    mrSigner: Uint8Array;
    reserved3: Uint8Array;
    isvProdId: number;
    isvSvn: number;
    reserved4: Uint8Array;
    reportData: Uint8Array;
}

interface TDReport10 {
    teeTcbSvn: Uint8Array;
    mrSeam: Uint8Array;
    mrSignerSeam: Uint8Array;
    seamAttributes: Uint8Array;
    tdAttributes: Uint8Array;
    xfam: Uint8Array;
    mrTd: Uint8Array;
    mrConfigId: Uint8Array;
    mrOwner: Uint8Array;
    mrOwnerConfig: Uint8Array;
    rtMr0: Uint8Array;
    rtMr1: Uint8Array;
    rtMr2: Uint8Array;
    rtMr3: Uint8Array;
    reportData: Uint8Array;
}

interface TDReport15 {
    base: TDReport10;
    teeTcbSvn2: Uint8Array;
    mrServiceTd: Uint8Array;
}

interface CertificationData {
    certType: number;
    body: Data<number>;
}

interface QEReportCertificationData {
    qeReport: Uint8Array;
    qeReportSignature: Uint8Array;
    qeAuthData: Data<number>;
    certificationData: CertificationData;
}

interface AuthDataV3 {
    ecdsaSignature: Uint8Array;
    ecdsaAttestationKey: Uint8Array;
    qeReport: Uint8Array;
    qeReportSignature: Uint8Array;
    qeAuthData: Data<number>;
    certificationData: CertificationData;
}

interface AuthDataV4 {
    ecdsaSignature: Uint8Array;
    ecdsaAttestationKey: Uint8Array;
    certificationData: CertificationData;
    qeReportData: QEReportCertificationData;
}

type AuthData = AuthDataV3 | AuthDataV4;

interface Quote {
    header: Header;
    report: EnclaveReport | TDReport10 | TDReport15;
    authData: AuthData;
}

export type { Header, TDReport10, TDReport15, EnclaveReport, AuthData, AuthDataV3, AuthDataV4, Quote };

const decodeAuthData = (ver: number, input: Uint8Array): AuthData => {
    let offset = 0;
    const view = new DataView(input.buffer);

    // Parse ECDSA signature (64 bytes)
    const ecdsaSignature = input.slice(offset, offset + 64);
    offset += 64;

    // Parse ECDSA attestation key (64 bytes)
    const ecdsaAttestationKey = input.slice(offset, offset + 64);
    offset += 64;

    // Parse certification data
    const certType = view.getUint16(offset, true);
    offset += 2;
    const certDataSize = view.getUint32(offset, true);
    offset += 4;
    const certData = {
        certType,
        body: {
            data: input.slice(offset, offset + certDataSize)
        }
    };
    offset += certDataSize;

    // For version 4, parse QE report data
    if (ver === 4) {
        const qeReport = input.slice(offset);
        offset += qeReport.length;
        const qeReportSignature = input.slice(offset);
        offset += qeReportSignature.length;
        const qeAuthDataSize = view.getUint32(offset, true);
        offset += 4;
        const qeAuthData = {
            data: input.slice(offset, offset + qeAuthDataSize)
        };
        offset += qeAuthDataSize;
        const qeReportCertType = view.getUint16(offset, true);
        offset += 2;
        const qeReportCertDataSize = view.getUint32(offset, true);
        offset += 4;
        const qeReportCertData = {
            certType: qeReportCertType,
            body: {
                data: input.slice(offset)
            }
        };

        return {
            ecdsaSignature,
            ecdsaAttestationKey,
            certificationData: certData,
            qeReportData: {
                qeReport,
                qeReportSignature,
                qeAuthData,
                certificationData: qeReportCertData
            }
        } as AuthDataV4;
    }

    // For version 3
    return {
        ecdsaSignature,
        ecdsaAttestationKey,
        qeReport: input.slice(offset, offset + 384),
        qeReportSignature: input.slice(offset + 384, offset + 448),
        qeAuthData: {
            data: input.slice(offset + 448, offset + 512)
        },
        certificationData: certData
    } as AuthDataV3;
};

const parseQuote = (quote: string): Quote => {
    // Convert hex string to Uint8Array
    const hexToBytes = (hex: string) => {
        if (hex.length % 2 !== 0) {
            throw new Error('Hex string must have an even number of characters');
        }
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            const byte = parseInt(hex.slice(i, i + 2), 16);
            if (isNaN(byte)) {
                throw new Error('Invalid hex string');
            }
            bytes[i / 2] = byte;
        }
        return bytes;
    };

    // Helper function to convert Uint8Array to hex string for logging
    const bytesToHex = (bytes: Uint8Array): string => {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    if (!quote) {
        throw new Error('Quote string cannot be empty');
    }

    const quoteBytes = hexToBytes(quote);
    let offset = 0;

    // Parse Header (48 bytes)
    const header: Header = {
        version: quoteBytes[offset++],
        attestationKeyType: quoteBytes[offset++],
        teeType: quoteBytes[offset++],
        qeSvn: quoteBytes[offset++],
        pceSvn: quoteBytes[offset++],
        qeVendorId: quoteBytes.slice(offset, offset + 16),
        userData: quoteBytes.slice(offset + 16, offset + 20)
    };
    offset += 36;  // Skip to end of header (16 + 20)

    // Create DataView for parsing multi-byte integers
    const view = new DataView(quoteBytes.buffer);
    
    // Skip body type and size (6 bytes)
    offset += 6;

    // Parse TDReport10 (584 bytes)
    const tdReport: TDReport10 = {
        teeTcbSvn: quoteBytes.slice(offset, offset + 16),
        mrSeam: quoteBytes.slice(offset + 16, offset + 48),
        mrSignerSeam: quoteBytes.slice(offset + 48, offset + 80),
        seamAttributes: quoteBytes.slice(offset + 80, offset + 96),
        tdAttributes: quoteBytes.slice(offset + 96, offset + 112),
        xfam: quoteBytes.slice(offset + 112, offset + 128),
        mrTd: quoteBytes.slice(offset + 128, offset + 160),
        mrConfigId: quoteBytes.slice(offset + 160, offset + 192),
        mrOwner: quoteBytes.slice(offset + 192, offset + 224),
        mrOwnerConfig: quoteBytes.slice(offset + 224, offset + 256),
        rtMr0: quoteBytes.slice(offset + 256, offset + 288),
        rtMr1: quoteBytes.slice(offset + 288, offset + 320),
        rtMr2: quoteBytes.slice(offset + 320, offset + 352),
        rtMr3: quoteBytes.slice(offset + 352, offset + 384),
        reportData: quoteBytes.slice(offset + 384, offset + 416)
    };
    offset += 584;

    // Parse ECDSA signature (64 bytes)
    const ecdsaSignature = quoteBytes.slice(offset, offset + 64);
    offset += 64;

    // Parse QE authentication data
    const qeAuthData = quoteBytes.slice(offset, offset + 64);
    offset += 64;

    // Parse certification data
    const certType = view.getUint16(offset, true);
    offset += 2;
    const certDataSize = view.getUint32(offset, true);
    offset += 4;

    // Parse certification data body
    const certData = {
        certType,
        body: {
            data: quoteBytes.slice(offset)  // Take all remaining data as cert data
        }
    };

    // Create AuthDataV4 structure
    const authData: AuthDataV4 = {
        ecdsaSignature,
        ecdsaAttestationKey: qeAuthData,
        certificationData: certData,
        qeReportData: {
            qeReport: new Uint8Array(0),
            qeReportSignature: new Uint8Array(0),
            qeAuthData: {
                data: new Uint8Array(0)
            },
            certificationData: certData
        }
    };

    // Log parsed data for verification
    console.log('Parsed Quote:', {
        header: {
            version: header.version,
            attestationKeyType: header.attestationKeyType,
            teeType: header.teeType,
            qeSvn: header.qeSvn,
            pceSvn: header.pceSvn,
            qeVendorId: bytesToHex(header.qeVendorId),
            userData: bytesToHex(header.userData)
        },
        tdReport: {
            mrTd: bytesToHex(tdReport.mrTd),
            mrConfigId: bytesToHex(tdReport.mrConfigId),
            reportData: bytesToHex(tdReport.reportData)
        },
        authData: {
            ecdsaSignature: bytesToHex(ecdsaSignature),
            ecdsaAttestationKey: bytesToHex(qeAuthData),
            certType: certType.toString(16),
            certDataSize
        }
    });

    return {
        header,
        report: tdReport,
        authData
    };
};

export { parseQuote };

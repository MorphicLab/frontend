import { u16, u32, Struct, Vector, u8 } from "scale-ts"

const ECDSA_SIGNATURE_BYTE_LEN = 64;
const ECDSA_PUBKEY_BYTE_LEN = 64;

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
    certificationData?: CertificationData;
    qeReportData?: QEReportCertificationData;
}

type AuthData = AuthDataV3 | AuthDataV4;

interface Quote {
    header: Header;
    report: EnclaveReport | TDReport10 | TDReport15;
    authData: AuthData;
}

// Interface for hex encoded Quote fields
export interface QuoteString {
    header: {
        version: string;
        attestationKeyType: string;
        teeType: string;
        qeVendorId: string;
        userData: string;
    };
    report: {};
    authData: {
        ecdsaSignature: string;
        ecdsaAttestationKey: string;
        certification: string;
        qeReport: string;
        qeReportSignature: string;
        qeAuthData: string;
        certification_data: string;
    };
}

export type { Header, TDReport10, TDReport15, EnclaveReport, AuthData, AuthDataV3, AuthDataV4, Quote };

const parseQuote = (quote: string): Quote => {
    if (!quote) {
        throw new Error('Quote string cannot be empty');
    }

    const header_decoder = Struct({
        version: u16,
        attestationKeyType: u16,
        teeType: u32,
        qe_svn: u16,
        pce_svn: u16,
        qe_vendor_id: Vector(u8, 16),
        user_data: Vector(u8, 20),
      })

    const decoded_header = header_decoder.dec(quote)

    const header: Header = {
        version: decoded_header.version,
        attestationKeyType: decoded_header.attestationKeyType,
        teeType: decoded_header.teeType,
        qeSvn: decoded_header.qe_svn,
        pceSvn: decoded_header.pce_svn,
        qeVendorId: new Uint8Array(decoded_header.qe_vendor_id),
        userData: new Uint8Array(decoded_header.user_data),
    };

    const report_decoder = Struct({
        tee_tcb_svn: Vector(u8, 16),
        mr_seam: Vector(u8, 48),
        mr_signer_seam: Vector(u8, 48),
        seam_attributes: Vector(u8, 8),
        td_attributes: Vector(u8, 8),
        xfam: Vector(u8, 8),
        mr_td: Vector(u8, 48),
        mr_config_id: Vector(u8, 48),
        mr_owner: Vector(u8, 48),
        mr_owner_config: Vector(u8, 48),
        rt_mr0: Vector(u8, 48),
        rt_mr1: Vector(u8, 48),
        rt_mr2: Vector(u8, 48),
        rt_mr3: Vector(u8, 48),
        report_data: Vector(u8, 64),
      })
    const decoded_report = report_decoder.dec(quote.slice(96))

    const tdReport: TDReport10 = {
        teeTcbSvn: new Uint8Array(decoded_report.tee_tcb_svn),
        mrSeam: new Uint8Array(decoded_report.mr_seam),
        mrSignerSeam: new Uint8Array(decoded_report.mr_signer_seam),
        seamAttributes: new Uint8Array(decoded_report.seam_attributes),
        tdAttributes: new Uint8Array(decoded_report.td_attributes),
        xfam: new Uint8Array(decoded_report.xfam),
        mrTd: new Uint8Array(decoded_report.mr_td),
        mrConfigId: new Uint8Array(decoded_report.mr_config_id),
        mrOwner: new Uint8Array(decoded_report.mr_owner),
        mrOwnerConfig: new Uint8Array(decoded_report.mr_owner_config),
        rtMr0: new Uint8Array(decoded_report.rt_mr0),
        rtMr1: new Uint8Array(decoded_report.rt_mr1),
        rtMr2: new Uint8Array(decoded_report.rt_mr2),
        rtMr3: new Uint8Array(decoded_report.rt_mr3),
        reportData: new Uint8Array(decoded_report.report_data),
    };

    const auth_data_decoder = Struct({
        ecdsa_signature: Vector(u8, ECDSA_SIGNATURE_BYTE_LEN),
        ecdsa_attestation_key: Vector(u8, ECDSA_PUBKEY_BYTE_LEN),
        // certification_data:
        // qe_report_data:
      })
    const decoded_auth_data = auth_data_decoder.dec(quote.slice(1272));
    
    const authData: AuthDataV4 = {
        ecdsaSignature: new Uint8Array(decoded_auth_data.ecdsa_signature),
        ecdsaAttestationKey: new Uint8Array(decoded_auth_data.ecdsa_attestation_key),  
    }

    return { header: header, report: tdReport, authData: authData };
};

// Helper function to convert Uint8Array to hex string
function arrayToHex(array: number[] | Uint8Array): string {
    const uint8Array = array instanceof Uint8Array ? array : new Uint8Array(array);
    return Array.from(uint8Array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Helper function to convert Uint8Array to string
function arrayToString(array: number[] | Uint8Array): string {
    const uint8Array = array instanceof Uint8Array ? array : new Uint8Array(array);
    return String.fromCharCode(...uint8Array);
}


// Convert Quote object to hex string format
const parseQuoteToJson = (quotestr: string): QuoteString => {
    const quote = parseQuote(quotestr);
    const getReportData = (report: EnclaveReport | TDReport10 | TDReport15) => {
        if ('mrEnclave' in report) {
            // EnclaveReport
            return {
                cpuSvn: arrayToHex(report.cpuSvn),
                miscSelect: report.miscSelect,
                reserved1: arrayToHex(report.reserved1),
                attributes: arrayToHex(report.attributes),
                mrEnclave: arrayToHex(report.mrEnclave),
                reserved2: arrayToHex(report.reserved2),
                mrSigner: arrayToHex(report.mrSigner),
                reserved3: arrayToHex(report.reserved3),
                isvProdId: report.isvProdId,
                isvSvn: report.isvSvn,
                reserved4: arrayToHex(report.reserved4),
                reportData: arrayToHex(report.reportData),
            };
        } else if ('mrTd' in report) {
            // TDReport10
            return {
                teeTcbSvn: arrayToHex(report.teeTcbSvn),
                mrSeam: arrayToHex(report.mrSeam),
                mrSignerSeam: arrayToHex(report.mrSignerSeam),
                seamAttributes: arrayToHex(report.seamAttributes),
                tdAttributes: arrayToHex(report.tdAttributes),
                xfam: arrayToHex(report.xfam),
                mrTd: arrayToHex(report.mrTd),
                mrConfigId: arrayToHex(report.mrConfigId),
                mrOwner: arrayToHex(report.mrOwner),
                mrOwnerConfig: arrayToHex(report.mrOwnerConfig),
                rtMr0: arrayToHex(report.rtMr0),
                rtMr1: arrayToHex(report.rtMr1),
                rtMr2: arrayToHex(report.rtMr2),
                rtMr3: arrayToHex(report.rtMr3),
                reportData: arrayToHex(report.reportData),
            }
        } else {
            // TDReport15
            return {
                base: getReportData(report.base),
                teeTcbSvn2: arrayToHex(report.teeTcbSvn2),
                mrServiceTd: arrayToHex(report.mrServiceTd),
            }
        }
    };

    return {
        header: {
            version: arrayToHex([quote.header.version]),
            attestationKeyType: arrayToHex([quote.header.attestationKeyType]),
            teeType: arrayToHex([quote.header.teeType]),
            qeVendorId: arrayToHex(quote.header.qeVendorId),
            userData: arrayToHex(quote.header.userData),
        },
        report: getReportData(quote.report),
        authData: {
            ecdsaSignature: arrayToHex(quote.authData.ecdsaSignature),
            ecdsaAttestationKey: arrayToHex(quote.authData.ecdsaAttestationKey),
            certification: '', // Add empty string for certification
            qeReport: '', // Add empty string for qeReport
            qeReportSignature: '', // Add empty string for qeReportSignature
            qeAuthData: '', // Add empty string for qeAuthData
            certification_data: '', // Add empty string for certification_data
        }
    };
};

export const MOCK_QUOTE = '050002008100000000000000939a7233f79c4ca9940a0db3957f06076a3b57f48d470f1c01bf412a6f9cdb6200000000030088020000050102000000000000000000000000001cc6a17ab799e9a693fac7536be61c12ee1e0fabada82d0c999e08ccee2aa86de77b0870f558c570e7ffe55d6d47fa0400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000e742060000000000dfba221b48a22af8511542ee796603f37382800840dcd978703909bf8e64d4c8a1e9de86e7c9638bfcba422f3886400a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000436e21aa8d13ecee447799ecfcadce387ee7f7ecfc475fb8993de270ebfd71116b8f4c345bf7a25db9737ab15718e49b32fdc598a38b8444e4a8f72ef72fb7ea6f351c0c71e6c6fe2993472844dcf413c73a72fe616f3848835473c5581065c300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000047e7f84b16a9336b087cdadacf435c98dde1487bc159282d52382107e36ff3f0dce0b68905375d1a20fafee58ed745bb2f2f7f304a4590f16d5932788987397205010200000000000000000000000000383c87d3bbb047b2d171eaca95312ede99f258088dc788f6ae2ccf8b6dd848fe8d47629e08b3f6cbd4a00dd47a5a033dcc10000049550430822dcf8affd7833a6399cd8dc6c831362ec61722ade467080affbb3188db1b87b1fad96c94c2beb9fea7ca20494a513aaa5feb9e5e56a8e62d4815a5fbc4aebff5940000831dc7e4c0d2353d055be61b5713d938bc90bf7b9082644ea248803e9b89896163b4706e1d14ec7f1ded032bb4a1abbb2a5eaad470dd22b10600461000000202181a03ff0006000000000000000000000000000000000000000000000000000000000000000000000000000000001500000000000000e700000000000000e5a3a7b5d830c29';

export const mockQuote = parseQuoteToJson(MOCK_QUOTE);


export { parseQuoteToJson };

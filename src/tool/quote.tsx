import { _void, u16, u32, Struct, Vector, u8 } from "scale-ts"

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

export type { Header, TDReport10, TDReport15, EnclaveReport, AuthData, AuthDataV3, AuthDataV4, Quote };

const parseQuote = (quote: string): void => {
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

    // TODO: return quote(header, tdRerport, authData)
};

export { parseQuote };

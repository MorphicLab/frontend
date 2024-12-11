import { describe, expect, test } from '@jest/globals';
import { parseQuote, Quote, TDReport10, AuthDataV4 } from '../quote';
import { MOCK_QUOTE } from '../../data/mockData';

// Type guards
function isTDReport10(report: any): report is TDReport10 {
    return report && 'teeTcbSvn' in report;
}

function isAuthDataV4(authData: any): authData is AuthDataV4 {
    return authData && 'qeReportData' in authData;
}

describe('parseQuote', () => {
    // Sample quote from the implementation

    test('should parse quote header correctly', () => {
        const result = parseQuote(MOCK_QUOTE);
        
        expect(result.header).toBeDefined();
        expect(result.header.version).toBe(5);
        expect(result.header.attestationKeyType).toBe(0);
        expect(result.header.teeType).toBe(2);
        expect(result.header.qeSvn).toBe(0);
        expect(result.header.pceSvn).toBe(129);
        expect(result.header.qeVendorId).toHaveLength(16);
        expect(result.header.userData).toHaveLength(16);
    });

    test('should parse TDReport10 correctly', () => {
        const result = parseQuote(MOCK_QUOTE);
        expect(isTDReport10(result.report)).toBe(true);
        
        if (isTDReport10(result.report)) {
            expect(result.report.teeTcbSvn).toHaveLength(16);
            expect(result.report.mrSeam).toHaveLength(32);
            expect(result.report.mrSignerSeam).toHaveLength(32);
            expect(result.report.seamAttributes).toHaveLength(16);
            expect(result.report.tdAttributes).toHaveLength(16);
            expect(result.report.xfam).toHaveLength(16);
            expect(result.report.mrTd).toHaveLength(32);
            expect(result.report.mrConfigId).toHaveLength(32);
            expect(result.report.mrOwner).toHaveLength(32);
            expect(result.report.mrOwnerConfig).toHaveLength(32);
            expect(result.report.rtMr0).toHaveLength(32);
            expect(result.report.rtMr1).toHaveLength(32);
            expect(result.report.rtMr2).toHaveLength(32);
            expect(result.report.rtMr3).toHaveLength(32);
            expect(result.report.reportData).toHaveLength(32);
        }
    });

    test('should parse AuthData correctly', () => {
        const result = parseQuote(MOCK_QUOTE);
        expect(isAuthDataV4(result.authData)).toBe(true);
        
        if (isAuthDataV4(result.authData)) {
            expect(result.authData.ecdsaSignature).toHaveLength(64);
            expect(result.authData.ecdsaAttestationKey).toHaveLength(64);
            expect(result.authData.certificationData).toBeDefined();
            expect(result.authData.qeReportData).toBeDefined();
            expect(result.authData.qeReportData.qeReport).toHaveLength(384);
            expect(result.authData.qeReportData.qeReportSignature).toHaveLength(64);
            expect(result.authData.qeReportData.qeAuthData).toBeDefined();
            expect(result.authData.qeReportData.certificationData).toBeDefined();
        }
    });

    test('should handle invalid hex string', () => {
        expect(() => parseQuote('invalid hex')).toThrow();
    });

    test('should handle empty string', () => {
        expect(() => parseQuote('')).toThrow();
    });

    test('should handle quote with insufficient length', () => {
        const shortQuote = '0500'; // Too short to contain all required fields
        expect(() => parseQuote(shortQuote)).toThrow();
    });
});

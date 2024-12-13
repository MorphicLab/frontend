import { u16, u32, Struct, Vector, u8 } from "scale-ts"
import { QuoteString } from "../data/define";

const ECDSA_SIGNATURE_BYTE_LEN = 64;
const ECDSA_PUBKEY_BYTE_LEN = 64;
const ENCLAVE_REPORT_BYTE_LEN = 384;
const QE_REPORT_SIG_BYTE_LEN = ECDSA_PUBKEY_BYTE_LEN;

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
    qeAuthData: Uint8Array;
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
    qeReportData: QEReportCertificationData;
}

type AuthData = AuthDataV3 | AuthDataV4;

interface Quote {
    header: Header;
    report: EnclaveReport | TDReport10 | TDReport15;
    authData: AuthData;
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
      })
    const decoded_auth_data = auth_data_decoder.dec(quote.slice(1272));
    
    const qe_report_decoder = Struct({
        qe_report: Vector(u8, ENCLAVE_REPORT_BYTE_LEN),
        qe_report_signature: Vector(u8, QE_REPORT_SIG_BYTE_LEN),
        qe_auth_data: Vector(u8, 64),
      })
    const decoded_qe_report = qe_report_decoder.dec(quote.slice(1540));

    const certification_decoder = Vector(u8, 3678);
    const decoded_certification = certification_decoder.dec(quote.slice(2516));

    const authData: AuthDataV4 = {
        ecdsaSignature: new Uint8Array(decoded_auth_data.ecdsa_signature),
        ecdsaAttestationKey: new Uint8Array(decoded_auth_data.ecdsa_attestation_key), 
        qeReportData: {
            qeReport: new Uint8Array(decoded_qe_report.qe_report),
            qeReportSignature: new Uint8Array(decoded_qe_report.qe_report_signature),
            qeAuthData: new Uint8Array(decoded_qe_report.qe_auth_data),
            certificationData: {
                certType: 5,
                body: {
                    data: new Uint8Array(decoded_certification)
                }
            }
        }
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
            qeReport: arrayToHex(quote.authData.qeReportData.qeReport), 
            qeReportSignature: arrayToHex(quote.authData.qeReportData.qeReportSignature), 
            qeAuthData: arrayToHex(quote.authData.qeReportData.qeAuthData),
            certification_data: arrayToHex(quote.authData.qeReportData.certificationData.body.data),
        }
    };
};

export const MOCK_QUOTE = '040002008100000000000000939a7233f79c4ca9940a0db3957f060783fbfe61525f55581315cd9dc950f44700000000060102000000000000000000000000005b38e33a6487958b72c3c12a938eaa5e3fd4510c51aeeab58c7d5ecee41d7c436489d6c8e4f92f160b7cad34207b00c100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000e702060000000000c68518a0ebb42136c12b2275164f8c72f25fa9a34392228687ed6e9caeb9c0f1dbd895e9cf475121c029dc47e70e91fd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000274c2344116db7c663470693b5ba62b8621eac28cb41d2f816ddf188f9f423f900a1c44d32386fd3c993dc814e62af9de24f66fa69638e4ba2e065d87b8b2040f99b1921c00a53fcaa54ade7f11e24d8c0cdeb11c2c81fa56d3e20fdd9b437f36e7f9827cb3c9b3c567e1a2c513cf5de3eff074683bf6035c522f02c54b382ae7abeee4763b276068dc26670c928978e808f25efbb07a8dbf882a28de4fd1094b26ac343d7377a9a8bc04b4865041d23f0a35896966669829d7841ed1e4b4624966804e8f3c93fde6a742e3ac3770e0fe0e535c7191be075f3676f98cfd28802664449d3b1aa845cb4a019167db657e41d831ee139804da94e6491cda17ac04bcc1000002bcb2ce3d8dd28841de87b50305978c9faa9c3880b5e247db9f8bba3c3123e2ca962cf0f59e645cf9a912ea3130e5199d4b83f5340ab37ec114b08f1cc4de5104996a9e56e40ac6c0b019709537f16d751c03e8c0d905d79f224ff06ddc4102860a8770107748c011cdbfcccc857e418735b699ac89dc2ed4da11d5125cb925e0600461000000202191b03ff0006000000000000000000000000000000000000000000000000000000000000000000000000000000001500000000000000e700000000000000e5a3a7b5d830c2953b98534c6c59a3a34fdc34e933f7f5898f0a85cf08846bca0000000000000000000000000000000000000000000000000000000000000000dc9e2a7c6f948f17474e34a7fc43ed030f7c1563f1babddf6340c82e0e54a8c500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000503bbfe5befa55a13e21747c3859f0b618a050312a0340e980187eea232356d600000000000000000000000000000000000000000000000000000000000000002fb536dc65ff3270c0c66b31a7d9b4041aef409f0245685b98b2bba98f8bb60f8f5e7a9787ff881c5050059bf87298c9fa94492b555976bd6e75e7b0b71226d02000000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f05005e0e00002d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d49494538444343424a65674177494241674956414c5235544954392b396e73423142545a3173725851346c627752424d416f4743437147534d343942414d430a4d484178496a416742674e5642414d4d47556c756447567349464e4857434251513073675547786864475a76636d306751304578476a415942674e5642416f4d0a45556c756447567349454e76636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155450a4341774351304578437a414a42674e5642415954416c56544d423458445449304d4467774d6a45784d54557a4e316f5844544d784d4467774d6a45784d54557a0a4e316f77634445694d434147413155454177775a535735305a5777675530645949464244537942445a584a3061575a70593246305a5445614d426747413155450a43677752535735305a577767513239796347397959585270623234784644415342674e564241634d43314e68626e526849454e7359584a684d517377435159440a5651514944414a445154454c4d416b474131554542684d4356564d775754415442676371686b6a4f5051494242676771686b6a4f50514d4242774e43414154590a77777155344778504a6a596f6a4d4752686136327970346a425164355744764b776d54366c6c314147786a59363870694a50676950686462387a544766374b620a314f79643153464f4d5a70594c795054427a59646f3449444444434341776777487759445652306a42426777466f41556c5739647a62306234656c4153636e550a3944504f4156634c336c5177617759445652306642475177596a42676f46366758495a616148523063484d364c79396863476b7564484a316333526c5a484e6c0a636e5a705932567a4c6d6c75644756734c6d4e766253397a5a3367765932567964476c6d61574e6864476c76626939324e4339775932746a636d772f593245390a6347786864475a76636d306d5a57356a62325270626d63395a4756794d423047413155644467515742425146303476507654474b7762416c356f54765664664d0a2b356a6e7554414f42674e56485138424166384542414d434273417744415944565230544151482f4241497741444343416a6b4743537147534962345451454e0a4151534341696f776767496d4d42344743697147534962345451454e41514545454e3564416f7135634b356e383277396f793165346e34776767466a42676f710a686b69472b453042445145434d494942557a415142677371686b69472b4530424451454341514942416a415142677371686b69472b45304244514543416749420a416a415142677371686b69472b4530424451454341774942416a415142677371686b69472b4530424451454342414942416a415142677371686b69472b4530420a4451454342514942417a415142677371686b69472b45304244514543426749424154415142677371686b69472b453042445145434277494241444151426773710a686b69472b4530424451454343414942417a415142677371686b69472b45304244514543435149424144415142677371686b69472b45304244514543436749420a4144415142677371686b69472b45304244514543437749424144415142677371686b69472b45304244514543444149424144415142677371686b69472b4530420a44514543445149424144415142677371686b69472b45304244514543446749424144415142677371686b69472b453042445145434477494241444151426773710a686b69472b45304244514543454149424144415142677371686b69472b4530424451454345514942437a416642677371686b69472b45304244514543456751510a4167494341674d4241414d4141414141414141414144415142676f71686b69472b45304244514544424149414144415542676f71686b69472b453042445145450a4241617777473841414141774477594b4b6f5a496876684e4151304242516f424154416542676f71686b69472b453042445145474242424a316472685349736d0a682b2f46793074746a6a762f4d45514743697147534962345451454e415163774e6a415142677371686b69472b45304244514548415145422f7a4151426773710a686b69472b45304244514548416745422f7a415142677371686b69472b45304244514548417745422f7a414b42676771686b6a4f5051514441674e48414442450a41694270455738754f726b537469486b4c4b6e6a426855416f637a39545733366a4e2f303765416844503635617749674d2f31474c58745a70446436706150760a535a386d4e7472543830305635346b465944474f7a4f78504374383d0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d4949436c6a4343416a32674177494241674956414a567658633239472b487051456e4a3150517a7a674658433935554d416f4743437147534d343942414d430a4d476778476a415942674e5642414d4d45556c756447567349464e48574342536232393049454e424d526f77474159445651514b4442464a626e526c624342440a62334a7762334a6864476c76626a45554d424947413155454277774c553246756447456751327868636d4578437a414a42674e564241674d416b4e424d5173770a435159445651514745774a56557a4165467730784f4441314d6a45784d4455774d5442614677307a4d7a41314d6a45784d4455774d5442614d484178496a41670a42674e5642414d4d47556c756447567349464e4857434251513073675547786864475a76636d306751304578476a415942674e5642416f4d45556c75644756730a49454e76636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b474131554543417743513045780a437a414a42674e5642415954416c56544d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a304441516344516741454e53422f377432316c58534f0a3243757a7078773734654a423732457944476757357258437478327456544c7136684b6b367a2b5569525a436e71523770734f766771466553786c6d546c4a6c0a65546d693257597a33714f42757a43427544416642674e5648534d4547444157674251695a517a575770303069664f44744a5653763141624f536347724442530a42674e5648523845537a424a4d45656752614244686b466f64485277637a6f764c324e6c636e52705a6d6c6a5958526c63793530636e567a6447566b633256790a646d6c6a5a584d75615735305a577775593239744c306c756447567355306459556d397664454e424c6d526c636a416442674e5648513445466751556c5739640a7a62306234656c4153636e553944504f4156634c336c517744675944565230504151482f42415144416745474d42494741315564457745422f7751494d4159420a4166384341514177436759494b6f5a497a6a30454177494452774177524149675873566b6930772b6936565947573355462f32327561586530594a446a3155650a6e412b546a44316169356343494359623153416d4435786b66545670766f34556f79695359787244574c6d5552344349394e4b7966504e2b0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a2d2d2d2d2d424547494e2043455254494649434154452d2d2d2d2d0a4d4949436a7a4343416a53674177494241674955496d554d316c71644e496e7a6737535655723951477a6b6e42717777436759494b6f5a497a6a3045417749770a614445614d4267474131554541777752535735305a5777675530645949464a766233516751304578476a415942674e5642416f4d45556c756447567349454e760a636e4276636d4630615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155454341774351304578437a414a0a42674e5642415954416c56544d423458445445344d4455794d5445774e4455784d466f58445451354d54497a4d54497a4e546b314f566f77614445614d4267470a4131554541777752535735305a5777675530645949464a766233516751304578476a415942674e5642416f4d45556c756447567349454e76636e4276636d46300a615739754d5251774567594456515148444174545957353059534244624746795954454c4d416b47413155454341774351304578437a414a42674e56424159540a416c56544d466b77457759484b6f5a497a6a3043415159494b6f5a497a6a3044415163445167414543366e45774d4449595a4f6a2f69505773437a61454b69370a314f694f534c52466857476a626e42564a66566e6b59347533496a6b4459594c304d784f346d717379596a6c42616c54565978465032734a424b357a6c4b4f420a757a43427544416642674e5648534d4547444157674251695a517a575770303069664f44744a5653763141624f5363477244425342674e5648523845537a424a0a4d45656752614244686b466f64485277637a6f764c324e6c636e52705a6d6c6a5958526c63793530636e567a6447566b63325679646d6c6a5a584d75615735300a5a577775593239744c306c756447567355306459556d397664454e424c6d526c636a416442674e564851344546675155496d554d316c71644e496e7a673753560a55723951477a6b6e4271777744675944565230504151482f42415144416745474d42494741315564457745422f7751494d4159424166384341514577436759490a4b6f5a497a6a3045417749445351417752674968414f572f35516b522b533943695344634e6f6f774c7550524c735747662f59693747535839344267775477670a41694541344a306c72486f4d732b586f356f2f7358364f39515778485241765a55474f6452513763767152586171493d0a2d2d2d2d2d454e442043455254494649434154452d2d2d2d2d0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

export const mockQuote = parseQuoteToJson(MOCK_QUOTE);


export { parseQuoteToJson };

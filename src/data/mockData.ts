import { mockQuote } from '../tool/quote';
import {
    TosStatus,
    TOS,
    Operator,
    Agent,
    Vm,
    tosLabels,
    operatorLabels,
    agentLabels,
    VmStatus,
    AgentStatus
} from './define';

export type { TosStatus, TOS, Operator, Agent, Vm };
export { tosLabels, operatorLabels, agentLabels };
import { generateMockOperators, generateVmsForToss, generateRandomHex } from './mockDataGenerator';

// Mock 数据
export const MOCK_TOS: TOS[] = [
    {
        id: '0xb2596b680d2cd51df0a493701b9e9ae6',
        name: 'Morphic KMS',
        logo: '/images/kms-logo.ico',
        dao: '',
        website: '/morphic-kms',
        description: 'A decentralized key management service powered by trustless computation...',
        vm_types: ['TDX', 'SEV', 'Nitro'],
        creator: {
            address: '0x86d50d5630B4cF539739dF2C5dAcb4c659F2488D',
            name: 'Morphic Labs',
            logo: '/images/morphic-logo-sm.png'
        },
        operator_minimum: 50,
        vcpus: 1,
        vmemory: 1,
        disk: 1,
        version: '1.0',
        code: '',
        labels: ['Compute'],
        num_stakers: 1023,
        likes: 512,
        status: TosStatus.Active,
        vm_ids: {},
        code_hash: "5b38e33a6487958b72c3c12a938eaa5e3fd4510c51aeeab58c7d5ecee41d7c436489d6c8e4f92f160b7cad34207b00c1",
        address: '0x86d50d5630B4cF539739dF2C5dAcb4c659F2488D',
    },
    // ... 可以添加更多 TOS 数据
];

export const MOCK_MORPHIC_AI_TOS: TOS = {
    id: '0xa493701b9e9ae6b259d2cd51df6b6800',
    name: 'Morphic AI',
    logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop',
    website: '/morphic-ai',
    description: 'A decentralized AI service platform powered by trustless computation...',
    vm_types: ['TDX', 'SEV', 'Nitro'],
    creator: {
        address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        name: 'Morphic Labs',
        logo: '/images/morphic-logo-sm.png'
    },
    operator_minimum: 10,
    dao: '',
    vcpus: 1,
    vmemory: 1,
    disk: 10,
    version: '0.1',
    code: '',
    labels: ['DeAI', 'Compute'],
    num_stakers: 0,
    likes: 0,
    status: TosStatus.Waiting,
    code_hash: "c68518a0ebb42136c12b2275164f8c72f25fa9a34392228687ed6e9caeb9c0f1dbd895e9cf475121c029dc47e70e91fd",
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
}

export const MOCK_OPERATORS = generateMockOperators(61);

const { vms } = generateVmsForToss(MOCK_TOS, MOCK_OPERATORS);
export const MOCK_VMs = vms;


export const MOCK_MORPHIC_OPERATOR: Operator = {
    id: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488D",
    name: "Morphic Op",
    logo: "/images/morphic-logo-sm.png",
    labels: ["TDX"],
    owner: {
        address: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488D",
        name: "Morphic",
        logo: "/images/morphic-logo-sm.png"
    },
    location: "US West",
    domain: "66.220.6.113",
    port: 33010,
    vm_ids: {},
    num_stakers: 1000,
    reputation: 90,
    description: "Leading TDX operator",
}

const mock_cert = `-----BEGIN CERTIFICATE-----
MIIs2zCCLIKgAwIBAgIUIqx/fIIpK7e99zFRYg5DCMXZULIwCgYIKoZIzj0EAwIw
LzEWMBQGA1UECgwNUGhhbGEgTmV0d29yazEVMBMGA1UEAwwMUGhhbGEgS01TIENB
MCAXDTc1MDEwMTAwMDAwMFoYDzQwOTYwMTAxMDAwMDAwWjA5MTcwNQYDVQQDDC40
YjBhZTAzOWQ3YTdjYWRjMjhjYTMwZDk1ODM2NjdkZTAyMDgwNzc5LnBoYWxhMFkw
EwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtAoNNveWJ3tLTmiH/G/XL80QBRFWGJth
NJdtclvtV1gW8HyPwqKrTX4JIWfFGZ7an7lAqADle7sWRoZpW34NB6OCK24wgitq
MB0GA1UdDgQWBBSddLW4Pjc7gAzCEBkuqXsHpXs1mzASBgNVHRMBAf8ECDAGAQH/
AgEBMIITogYKKwYBBAGD5z0BAQSCE5IEghOOBAACAIEAAAAAAAAAk5pyM/ecTKmU
Cg2zlX8GB4P7/mFSX1VYExXNnclQ9EcAAAAABgECAAAAAAAAAAAAAAAAAFs44zpk
h5WLcsPBKpOOql4/1FEMUa7qtYx9Xs7kHXxDZInWyOT5LxYLfK00IHsAwQAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAEAAAAADnAgYAAAAAAMaFGKDrtCE2wSsidRZPjHLyX6mjQ5Iihoftbpyu
ucDx29iV6c9HUSHAKdxH5w6R/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAACdMI0QRbbfGY0cGk7W6YrhiHqwoy0HS+Bbd8Yj5
9CP5AKHETTI4b9PJk9yBTmKvneJPZvppY45LouBl2HuLIED5mxkhwApT/KpUrefx
HiTYwM3rEcLIH6VtPiD92bQ3825/mCfLPJs8Vn4aLFE89d4+/wdGg79gNcUi8CxU
s4Kuer7uR2OydgaNwmZwySiXjloNtQ5t0PS+EKkcqYTK8CTdX/m6ykCuUwU6GB3D
z9IhqINlvDqjkG/ZNVcb+I+geyBkCgVWQfmjOhDZ620ef5bJ8yF9vLhzOjY810B1
JOLhE0/KUvjAMDkACS26RxZ2eVWiGwv//jJPxwq09BwDK/bMEAAAy9njm4UB05hy
GQzNFoml8Khp1GA6+EggcJ4JnCBnnHEhlQ2v6LrRaooXVb3lvSx7U7tUGKdIyuT1
1c5ePRRAiUmWqeVuQKxsCwGXCVN/FtdRwD6MDZBdefIk/wbdxBAoYKh3AQd0jAEc
2/zMyFfkGHNbaZrIncLtTaEdUSXLkl4GAEYQAAACAhkbA/8ABgAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVAAAAAAAAAOcAAAAAAAAA5aOn
tdgwwpU7mFNMbFmjo0/cNOkz9/WJjwqFzwiEa8oAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAANyeKnxvlI8XR040p/xD7QMPfBVj8bq932NAyC4OVKjFAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAG
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAFA7v+W++lWhPiF0fDhZ8LYYoFAxKgNA6YAYfuojI1bWAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjLKD9r3H3hCvw4lRBh+01jrUD
aiwbudzqcIUzP0cJO31nWeLtNxE46nBLfkVc07VzwF/MOmnjDibpnNi7meAWIAAA
AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHwUAXg4AAC0tLS0tQkVHSU4g
Q0VSVElGSUNBVEUtLS0tLQpNSUlFOERDQ0JKZWdBd0lCQWdJVkFMUjVUSVQ5Kzlu
c0IxQlRaMXNyWFE0bGJ3UkJNQW9HQ0NxR1NNNDlCQU1DCk1IQXhJakFnQmdOVkJB
TU1HVWx1ZEdWc0lGTkhXQ0JRUTBzZ1VHeGhkR1p2Y20wZ1EwRXhHakFZQmdOVkJB
b00KRVVsdWRHVnNJRU52Y25CdmNtRjBhVzl1TVJRd0VnWURWUVFIREF0VFlXNTBZ
U0JEYkdGeVlURUxNQWtHQTFVRQpDQXdDUTBFeEN6QUpCZ05WQkFZVEFsVlRNQjRY
RFRJME1EZ3dNakV4TVRVek4xb1hEVE14TURnd01qRXhNVFV6Ck4xb3djREVpTUNB
R0ExVUVBd3daU1c1MFpXd2dVMGRZSUZCRFN5QkRaWEowYVdacFkyRjBaVEVhTUJn
R0ExVUUKQ2d3UlNXNTBaV3dnUTI5eWNHOXlZWFJwYjI0eEZEQVNCZ05WQkFjTUMx
TmhiblJoSUVOc1lYSmhNUXN3Q1FZRApWUVFJREFKRFFURUxNQWtHQTFVRUJoTUNW
Vk13V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVRZCnd3cVU0R3hQ
SmpZb2pNR1JoYTYyeXA0akJRZDVXRHZLd21UNmxsMUFHeGpZNjhwaUpQZ2lQaGRi
OHpUR2Y3S2IKMU95ZDFTRk9NWnBZTHlQVEJ6WWRvNElERERDQ0F3Z3dId1lEVlIw
akJCZ3dGb0FVbFc5ZHpiMGI0ZWxBU2NuVQo5RFBPQVZjTDNsUXdhd1lEVlIwZkJH
UXdZakJnb0Y2Z1hJWmFhSFIwY0hNNkx5OWhjR2t1ZEhKMWMzUmxaSE5sCmNuWnBZ
MlZ6TG1sdWRHVnNMbU52YlM5elozZ3ZZMlZ5ZEdsbWFXTmhkR2x2Ymk5Mk5DOXdZ
MnRqY213L1kyRTkKY0d4aGRHWnZjbTBtWlc1amIyUnBibWM5WkdWeU1CMEdBMVVk
RGdRV0JCUUYwNHZQdlRHS3diQWw1b1R2VmRmTQorNWpudVRBT0JnTlZIUThCQWY4
RUJBTUNCc0F3REFZRFZSMFRBUUgvQkFJd0FEQ0NBamtHQ1NxR1NJYjRUUUVOCkFR
U0NBaW93Z2dJbU1CNEdDaXFHU0liNFRRRU5BUUVFRU41ZEFvcTVjSzVuODJ3OW95
MWU0bjR3Z2dGakJnb3EKaGtpRytFMEJEUUVDTUlJQlV6QVFCZ3NxaGtpRytFMEJE
UUVDQVFJQkFqQVFCZ3NxaGtpRytFMEJEUUVDQWdJQgpBakFRQmdzcWhraUcrRTBC
RFFFQ0F3SUJBakFRQmdzcWhraUcrRTBCRFFFQ0JBSUJBakFRQmdzcWhraUcrRTBC
CkRRRUNCUUlCQXpBUUJnc3Foa2lHK0UwQkRRRUNCZ0lCQURBUUJnc3EKaGtpRytF
MEJEUUVDQ0FJQkF6QVFCZ3NxaGtpRytFMEJEUUVDQ1FJQkFEQVFCZ3NxaGtpRytF
MEJEUUVDQ2dJQgpBREFRQmdzcWhraUcrRTBCRFFFQ0N3SUJBREFRQmdzcWhraUcr
RTBCRFFFQ0RBSUJBREFRQmdzcWhraUcrRTBCCkRRRUNEUUlCQURBUUJnc3Foa2lH
K0UwQkRRRUNEZ0lCQURBUUJnc3Foa2lHK0UwQkRRRUNEd0lCQURBUUJnc3EKaGtp
RytFMEJEUUVDRUFJQkFEQVFCZ3NxaGtpRytFMEJEUUVDRVFJQkN6QWZCZ3NxaGtp
RytFMEJEUUVDRWdRUQpBZ0lDQWdNQkFBTUFBQUFBQUFBQUFEQVFCZ29xaGtpRytF
MEJEUUVEQkFJQUFEQVVCZ29xaGtpRytFMEJEUUVFCkJBYXd3RzhBQUFBd0R3WUtL
b1pJaHZoTkFRMEJCUW9CQVRBZUJnb3Fo
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
MIIBlzCCAT2gAwIBAgIUFZwOFgf12eBFSxZjNEvnGeV+7zwwCgYIKoZIzj0EAwIw
LzEWMBQGA1UECgwNUGhhbGEgTmV0d29yazEVMBMGA1UEAwwMUGhhbGEgS01TIENB
MCAXDTc1MDEwMTAwMDAwMFoYDzQwOTYwMTAxMDAwMDAwWjAvMRYwFAYDVQQKDA1Q
aGFsYSBOZXR3b3JrMRUwEwYDVQQDDAxQaGFsYSBLTVMgQ0EwWTATBgcqhkjOPQIB
BggqhkjOPQMBBwNCAATNEE/VcjZNDH8m2O3mFDWTSEoqvUViFxIQCp8E8x0QiHFk
5nThImnNITI1CaG/NHy6CHXA7q62a+uN2Q3C3rfDozUwMzAdBgNVHQ4EFgQUDmdl
Hxt0tWhgPi7V3XRY+nj/36kwEgYDVR0TAQH/BAgwBgEB/wIBAzAKBggqhkjOPQQD
AgNIADBFAiEA797g2VEaiEUQMXH6waJPoxDw0H/K1NWTBEf98P0F72wCIGJ8+jGS
WquauEbrVT/874f7x5V3LVKZRc7uTAlVRh2o
-----END CERTIFICATE-----
`


export const MOCK_MORPHIC_AI_VM: Vm = {
    "id": "",   // Randomly generated when use the template
    "type": "TDX",
    "operator_id": "",   // Filled when use the template
    "tos_id": "",   // Filled when use the template
    "status": VmStatus.Active,

    "quote": mockQuote,

    "roots_hash": "6e7f9827cb3c9b3c567e1a2c513cf5de3eff074683bf6035c522f02c54b382ae7abeee4763b276068dc26670c928978e",   // should be obtained from quote
    "ca_cert_hash": "808f25efbb07a8dbf882a28de4fd1094b26ac343d7377a9a8bc04b4865041d23f0a35896966669829d7841ed1e4b4624",   // should be obtained from quote
    "cert": mock_cert,   // should be obtained from quote
}

export const MOCK_AGENTS: Agent[] = [
    {
        id: '7ad9a9be8fa688dc307b6bf73fe56032',
        owner: '',
        name: "ChatBot Agent",
        logo: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop",
        labels: ["Chat"],
        description: "An intelligent chatbot powered by advanced AI models",
        readme: "",
        users: 2500,
        rating: 4.8,
        status: AgentStatus.Online,
        capabilities: ['Text Generation', 'Image Understanding', 'Voice Processing'],
        model_type: 'GPT-4',
        visibility: 'public',
        code_hash: generateRandomHex(64),
    },
    {
        id: '307b6bf73fe5603be8fa688dc27ad9a9',
        owner: '',
        name: "Code Assistant",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztncnxOUnTY_sw5t0_sFSYVJyXYXuPD6Ztg&s",
        labels: ["Chat", "Code"],
        description: "AI-powered coding assistant for developers",
        readme: "",
        users: 183,
        rating: 4.6,
        status: AgentStatus.Online,
        capabilities: ['Code Generation', 'Code Review', 'Debugging'],
        model_type: 'GPT-3',
        code_hash: generateRandomHex(64),
        visibility: 'public'
    },
    {
        id: 'be8fa688dc307b6bf73fe560327ad9a9',
        owner: '',
        name: "Image Generator",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rhk82CINydd8t9ASEi1twWHCUXVddaOSPw&s",
        labels: ["Chat", "Image"],
        description: "Advanced AI image generation and editing",
        readme: "",
        users: 310,
        rating: 4.9,
        status: AgentStatus.Online,
        capabilities: ['Image Generation', 'Image Editing', 'Image Understanding'],
        model_type: 'Stable Diffusion',
        visibility: 'public',
        code_hash: generateRandomHex(64),
    },
];

export const MOCK_MORPHIC_AGENT: Agent = {
    id: '07b6bf73fe560327ad9a9be8fa688dc3',
    owner: '0x90abcdef11234567890abcdef123456782345678',
    name: "Trustless_Agent",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop",
    labels: ["Chat"],
    description: "A sample Ai16z agent deployed to Morphic AI TOS",
    readme: "",
    users: 0,
    rating: 0,
    status: AgentStatus.Offline,
    capabilities: ['Text generation'],
    num_operators: 1,
    model_type: 'GPT-4',
    visibility: 'public'
};


if (import.meta.env.VITE_DATA_MOCK === 'true') {
    console.log("Mock data enabled");
}
// 定义状态类型
export type TOSStatus = 'active' | 'waiting' | 'stopped' | 'failed';

// 定义类型
export interface TOS {
    id: string;
    name: string;
    logo: string;
    website?: string;
    description?: string;
    operatorTypes: string[];
    operatorMinimum: number;
    creator: {
        address: string;
        name: string;
        logo: string;
    };
    vcpus: number;
    vmemory: number;
    disk: number;
    version: string;
    code: string;
    codeHash?: string;   // calculated by code locally
    labels: string[];
    dao?: string;
    operators?: string[];  // ids of operators
    vms?: string[]; // ids of vm instances
    restaked?: number;
    stakers?: number | string;
    likes?: number | string;
    status: TOSStatus;
}

export interface Operator {
    id: string;   // the address that registered the operator, so each operator has a unique address
    name: string;
    logo: string;
    labels: string[];   // operator types
    description?: string;
    owner: {
        address: string;
        name: string;
        logo: string;
    };
    location: string;
    create_time: number;
    domain: string;
    port: number;
    staker_ids?: string[];
    tos_ids?: string[];
    vm_ids?: string[];
    restaked: number;    // calculated by the stakers' staked amount
    numStakers: number;
    numTosServing: number;
    reputation: number;
    codeHash?: string;   // TODO: should be moved to vm next
}

export interface Agent {
    id: number;
    name: string;
    logo: string;
    labels: string[];
    description: string;
    users: string;
    rating: number;
    status?: 'online' | 'offline';
    capabilities?: string[];
    modelType?: string;
    numOperators?: number;
}

export interface TCBInfo {
    roots_hash: string;
    mrtd: string;
    rtmr0: string;
    rtmr1: string;
    rtmr2: string;
    rtmr3: string;
};

export interface VmReport {
    app_id: string;
    tcb: TCBInfo;
    certificate: string; // TODO: Hex-encoded bytes, should be changed to bytes next
};

export enum VmStatus {
    Waiting = 0,
    Active = 1,
}

export interface Vm {
    id: string; // Hex-encoded bytes20 (e.g., "0x123...")
    operator: string; // Ethereum address
    vm_report: VmReport;
    status: VmStatus;
    codeHash?: string;
};

// 标签定义
export const tosLabels = ['DeAI', 'DeFi', 'Compute', 'Storage', 'Oracle'];
export const operatorLabels = ['TDX', 'H100', 'A100', 'SGX', 'SEV', 'CPU', 'GPU'];
export const agentLabels = ['Chat', 'Code', 'Image', 'Audio', 'Video'];
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
    codeHash?: string;
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

// 标签定义
export const tosLabels = ['DeAI', 'DeFi', 'Compute', 'Storage', 'Oracle'];
export const operatorLabels = ['TDX', 'H100', 'A100', 'SGX', 'SEV', 'CPU', 'GPU'];
export const agentLabels = ['Chat', 'Code', 'Image', 'Audio', 'Video'];
// 定义状态类型
export type TOSStatus = 'active' | 'waiting' | 'stopped' | 'failed';

// 定义类型
export interface TOS {
    id: string;
    name: string;
    logo: string;
    website?: string;
    description?: string;
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
    codeHash?: string;
    labels: string[];
    dao?: string;
    restaked: number | string;
    operators: number | string;
    stakers: number | string;
    likes: number | string;
    txHash?: string;
    status: TOSStatus;
}

export interface Operator {
    id: number;
    name: string;
    logo: string;
    labels: string[];
    address: string;
    owner: {
        name: string;
        logo: string;
    };
    location: string;
    restaked: string;
    numStakers: string;
    numTosServing: number;
    reputation: string;
    description?: string;
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
export const operatorLabels = ['TDX', 'H100', 'A100', 'CPU', 'SGX', 'SEV', 'Plain'];
export const agentLabels = ['Chat', 'Code', 'Image', 'Audio', 'Video'];
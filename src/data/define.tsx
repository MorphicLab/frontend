// 定义状态类型
export type TOSStatus = 'active' | 'waiting' | 'stopped' | 'failed';

// 定义类型
export interface TOS {
    id: number;
    name: string;
    logo: string;
    address: string;
    website?: string;
    introduction: string;
    publisher: {
        name: string;
        logo: string;
    };
    labels: string[];
    restaked: number | string;
    operators: number | string;
    stakers: number | string;
    likes: number | string;
    txHash?: string;
    status: TOSStatus;
    codeHash?: string;
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
    introduction?: string;
    codeHash?: string;
}

export interface Agent {
    id: number;
    name: string;
    logo: string;
    labels: string[];
    introduction: string;
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
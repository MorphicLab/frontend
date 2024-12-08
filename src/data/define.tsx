// 定义状态类型
export type TOSStatus = 'active' | 'waiting' | 'stopped' | 'failed';

// 定义类型
export interface TOS {
    id: string;
    name: string;
    logo: string;
    website?: string;
    description?: string;
    operator_types: string[];
    operator_minimum: number;
    creator: {
        address: string;
        name: string;
        logo: string;
    };
    vcpus: number;
    vmemory: number;
    disk: number;
    version: string;
    code: string;  // docker-compose file contents
    code_hash?: string;   // calculated by code locally, corresponding to mrtd
    labels: string[];
    dao?: string;
    status: TOSStatus;  // active, waiting, stopped read from blockchain
    operators?: string[];  // ids of operators
    vms?: string[]; // ids of vm instances
    restaked?: number;
    stakers?: number | string;
    likes?: number | string;
    cert?: string;      // generated
    address?: string;   // generated. the address inside TOS vms to sign messages and control balances.
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
    num_stakers: number;
    num_tos_serving: number;
    reputation: number;
    code_hash?: string;   // TODO: should be moved to vm next
}

export interface Agent {
    id: number;
    owner: string;
    name: string;
    logo: string;
    labels: string[];
    description: string;
    readme: string;
    users: string;
    rating: number;
    status?: 'online' | 'offline';
    capabilities?: string[];
    num_operators?: number;
    memory_requirement?: string;
    storage_requirement?: string;
    dao_contract?: string;
    model_type: string;
    visibility: string;
    docker_compose?: string;
}

export interface VmQuote {  // now using quote of TDX
    type: string;  
    cpu_svn: string; 
    tcb_hash: string;
    td_info_hash: string;
    report_data: string;
    signature: string;
};

export interface VmInfo {   // now using TD info of TDX
    rootfs_hash: string;
    mrtd: string;
    rtmr0: string;
    rtmr1: string;
    rtmr2: string;
    rtmr3: string;
};

export interface VmTosInfo { 
    code_hash: string;   // app-id of dstack event_log
    ca_cert_hash?: string;   // ca-cert-hash of dstack event_log
};


export interface VmReport {   // now using report of TDX
    app_id: string;
    quote?: VmQuote;
    tcb: VmInfo;
    tos?: VmTosInfo;
};

export enum VmStatus {
    Waiting = 0,
    Active = 1,
}

export interface Vm {
    id: string; // Hex-encoded bytes20 (e.g., "0x123...")
    operator: string; // Ethereum address
    type: string;
    report: VmReport;
    status: VmStatus;
    code_hash?: string;
};

// 标签定义
export const tosLabels = ['DeAI', 'DeFi', 'Compute', 'Storage', 'Oracle'];
export const operatorLabels = ['TDX', 'H100', 'A100', 'SGX', 'SEV', 'CPU', 'GPU'];
export const agentLabels = ['Chat', 'Code', 'Image', 'Audio', 'Video'];
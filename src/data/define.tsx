// 定义状态类型
export enum TosStatus {
    Waiting = 0,
    Active = 1,
    Stopped = 2,
    Failed = 3
}

export interface TosCreator {
    address: string;
    name: string;
    logo: string;
}

// 定义类型
export interface TOS {
    id: string;
    name: string;
    logo: string;
    website?: string;
    description?: string;
    labels: string[];
    vm_types: string[];  // vm types, at least one should be satisfied by a registering new vm.
    operator_minimum: number;
    creator: TosCreator;
    vcpus: number;
    vmemory: number;
    disk: number;
    version: string;
    code: string;  // docker-compose file contents
    code_hash?: string;   // calculated by code locally, corresponding to mrtd
    dao?: string;
    status: TosStatus;  // active, waiting, stopped read from blockchain
    vm_ids?: {   // calculated from other information
        [operatorId: string]: string[] // operator ID -> vm IDs mapping
    };
    restaked?: number;   // calculated from other information
    num_stakers?: number;    // calculated from other information
    likes?: number | string;    // calculated from other information
    address?: string;   // generated inside TEE for sign messages and control balances.
}

export interface OpCreator {
    address: string;
    name: string;
    logo: string;
}

export interface Operator {
    id: string;   // the address that registered the operator, so each operator has a unique address
    name: string;
    logo: string;
    labels: string[];   // operator types, just for display
    description?: string;
    owner: OpCreator;
    location: string;
    domain: string;
    port: number;
    vm_ids?: {     // calculated from other information
        [tosId: string]: string[] // TOS ID -> vm IDs mapping
    };
    restaked?: number;       // calculated from other information
    num_stakers?: number;    // calculated from other information
    num_tos_serving?: number; // calculated from other information
    reputation?: number;     // calculated from other information
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
    roots_hash: string;
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

export enum VmStatus {
    Waiting = 0,
    Active = 1,
}

export interface VmReport {   // now using report of TDX
    tos_info?: VmTosInfo;    // e.g., The TOS Info (code, certificate, address, etc.) of TDX
    tcb_info: VmInfo;        // e.g., The TD Info of TDX
    quote?: VmQuote;    // e.g., The signed Quote of TDX
};

export interface Vm {
    id: string;    // Hex-encoded bytes20 (e.g., "0x123..."), like the instance id from dstack
    type: string;
    tos_id: string;          // TOS ID
    operator_id: string;      // Operator ID
    report: VmReport;
    status: VmStatus;
    code_hash?: string;       // app-id of dstack event_log
    cert?: string;
};

export enum AgentStatus {
    Online = 0,
    Offline = 1
}

export interface Agent {
    id: number;
    owner: string;
    name: string;
    logo: string;
    labels: string[];
    description: string;
    readme: string;
    users: number;
    rating: number;
    status?: AgentStatus;
    capabilities?: string[];
    num_operators?: number;
    memory_requirement?: string;
    storage_requirement?: string;
    dao_contract?: string;
    model_type: string;
    visibility: string;
    docker_compose?: string;
    operator_domain?: string;
}

// 标签定义
export const tosLabels = ['DeAI', 'DeFi', 'Compute', 'Storage', 'Oracle'];
export const operatorLabels = ['TDX', 'SEV', 'H100', 'Nitro', 'A100', 'SGX', 'CPU', 'GPU'];
export const vmLabels = ['TDX', 'SEV', 'H100', 'Nitro', 'A100', 'SGX', 'CPU', 'GPU'];
export const agentLabels = ['Chat', 'Code', 'Image', 'Audio', 'Video'];
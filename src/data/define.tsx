import {  QuoteString } from "../tool/quote";

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

export interface VmTcbInfo {  
    mr_seam: string;
    mr_signer_seam: string;
    tee_tcb_svn: string;
    seam_attributes: string;
};

export interface VmTdInfo {
    td_attributes: string;
    xfam: string;
    mr_td: string;
    mr_config_id: string;
    mr_owner: string;
    mr_owner_config: string;
    rt_mr0: string;
    rt_mr1: string;
    rt_mr2: string;
    rt_mr3: string;
}

export interface VmQuote {
    tee_type: string; // 129 for TDX, 128 for SGX
    pce_svn: string;
    tcb_info_hash: string;
    td_info_hash: string;
    report_data: string;
    signature: string; // TODO: signatrue定义待确定 ecdsa_signature ? qe_report_signature ?
}

export interface VmReport {
    tee_type: string; // 129 for TDX, 128 for SGX
    pce_svn: string;
    tcb_info_hash: string;
    td_info_hash: string;
    report_data: string;
    mac?: string;
}



export enum VmStatus {
    Waiting = 0,
    Active = 1,
}


export interface Vm {
    id: string;    // Hex-encoded bytes20 (e.g., "0x123..."), like the instance id from dstack
    type: string;
    tos_id?: string;          // TOS ID
    operator_id?: string;      // Operator ID
    status?: VmStatus;


    // 先简化问题，不考虑TEE类型，quote格式可能有多个的情况。
    quote?: QuoteString;

    code_hash?: string;       // app-id of dstack event_log
    roots_hash: string;
    cert?: string;
    ca_cert_hash?: string;   // ca-cert-hash of dstack event_log
    pubkey?: string;
    address?: string;
    event_log?: string;
};

export enum AgentStatus {
    Offline = 0,
    Online = 1,
}

export interface Agent {
    id: string;
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
    code_hash?: string;
}

// 标签定义
export const tosLabels = ['DeAI', 'DeFi', 'Compute', 'Storage', 'Oracle'];
export const operatorLabels = ['TDX', 'SEV', 'H100', 'Nitro', 'A100', 'SGX', 'CPU', 'GPU'];
export const vmLabels = ['TDX', 'SEV', 'H100', 'Nitro', 'A100', 'SGX', 'CPU', 'GPU'];
export const agentLabels = ['Chat', 'Code', 'Image', 'Audio', 'Video'];
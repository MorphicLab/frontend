import { ethers } from 'ethers';
import { create } from 'zustand';
import { createContractInstance } from '../../request/vm';
import { TOS, Operator, Vm, Agent } from '../../data/define';
import { TOSStatus } from '../../data/define';

// Define the store state interface
interface BlockchainStore {
    toss: TOS[];
    operators: Operator[];
    vms: Vm[];
    agents: Agent[];
    
    // Fetch methods
    fetchTOSs: () => Promise<void>;
    fetchOperators: () => Promise<void>;
    fetchVms: () => Promise<void>;
    fetchAgents: () => Promise<void>;
    
    // Add methods
    addTOS: (tos: TOS) => void;
    addOperator: (operator: Operator) => void;
    addVm: (vm: Vm) => void;
    addAgent: (agent: Agent) => void;
    
    // Initialize store
    initializeStore: () => Promise<void>;
}

const DEFAULT_TOS_LOGO = '/images/morphic-logo-sm.png';
const DEFAULT_CREATOR_LOGO = '/images/morphic-logo-sm.png';
const DEFAULT_OPERATOR_LOGO = '/images/operator-logo-sm.png';
const DEFAULT_OPERATOR_OWNER_LOGO = '/images/operator-owner-logo-sm.png';

export const useBlockchainStore = create<BlockchainStore>((set, get) => ({
    toss: [],
    operators: [],
    vms: [],
    agents: [],

    fetchTOSs: async () => {
        try {
            const contract = await createContractInstance();
            
            // Get total number of TOSs
            const totalTOSs = await contract.total_toss();
            
            // Fetch each TOS
            const fetchedTOSs: TOS[] = [];
            for (let i = 0; i < totalTOSs; i++) {
                const tos = await contract.get_tos_by_index(i);
                fetchedTOSs.push({
                    id: tos.id,
                    name: tos.name || 'Unnamed Service',
                    logo: tos.logo || DEFAULT_TOS_LOGO,
                    website: tos.website || '',
                    description: tos.description || 'No description available',
                    operatorTypes: tos.operator_types || [],
                    creator: {
                        address: tos.creater,
                        name: tos.creater_name || 'Unknown',
                        logo: tos.creater_logo || DEFAULT_CREATOR_LOGO
                    },
                    operatorMinimum: Number(tos.operator_minimum),
                    vcpus: Number(tos.vcpus),
                    vmemory: Number(tos.vmemory),
                    disk: Number(tos.disk),
                    version: tos.version || '0.1',
                    code: ethers.hexlify(tos.code),
                    labels: tos.labels || [],
                    dao: tos.dao || ethers.ZeroAddress,
                    operators: tos.operator_ids || [], // Updated: now using operator_ids
                    status: Number(tos.status) === 0 ? 'waiting' : 'active' as TOSStatus,
                    restaked: 0,  // TODO: Calculate from operator staking data
                    stakers: 0,   // TODO: Calculate from operator staking data
                    likes: 0,     // TODO: Implement likes system
                    codeHash: ethers.keccak256(tos.code),
                });
            }
            
            set({ toss: fetchedTOSs });
        } catch (error) {
            console.error('Failed to fetch TOSs:', error);
        }
    },

    fetchOperators: async () => {
        try {
            const contract = await createContractInstance();
            
            // Get total number of operators
            const totalOperators = await contract.total_operators();
            
            // Fetch each operator
            const fetchedOperators: Operator[] = [];
            for (let i = 0; i < totalOperators; i++) {
                const op = await contract.get_operator_by_index(i);
                fetchedOperators.push({
                    id: op.id,
                        name: op.name || 'Unnamed Operator',
                        logo: op.logo || DEFAULT_OPERATOR_LOGO,
                        labels: op.operator_types || [],
                        owner: {
                            address: op.owner,
                            name: op.owner_name || 'Unknown',
                            logo: op.owner_logo || DEFAULT_OPERATOR_OWNER_LOGO
                        },
                        location: op.location || '',
                        create_time: Number(op.create_time),
                        domain: op.domain || '',
                        port: Number(op.port),
                        // Convert TOS IDs to string array
                        tos_ids: op.tos_ids?.map(id => id.toString()) || [],
                        staker_ids: op.staker_ids?.map(id => id.toString()) || [],
                        vm_ids: [],
                        restaked: 0,  // TODO: Calculate from staking data
                        numStakers: op.staker_ids?.length || 0,
                        numTosServing: op.tos_ids?.length || 0,
                        reputation: 0, // TODO: Implement reputation system
                });
            }
            
            set({ operators: fetchedOperators });
        } catch (error) {
            console.error('Failed to fetch operators:', error);
        }
    },

    fetchVms: async () => {
        try {

            // Implement VM fetching logic similar to TOSs and Operators
            const contract = await createContractInstance();
                
            // Get total number of vms
            const totalVms = await contract.total_vms();
            
            // Fetch each vm
            const fetchedVms: Vm[] = [];
            for (let i = 0; i < totalVms; i++) {
                const vm = await contract.get_vm_by_index(i);
                fetchedVms.push({
                    id: vm.id,
                    operator: vm.operator,
                    vm_report: {
                        app_id: vm.vm_report.app_id,
                        tcb: {
                            rootfs_hash: vm.vm_report.tcb.rootfs_hash,
                            mrtd: vm.vm_report.tcb.mrtd,
                            rtmr0: vm.vm_report.tcb.rtmr0,
                            rtmr1: vm.vm_report.tcb.rtmr1,
                            rtmr2: vm.vm_report.tcb.rtmr2,
                            rtmr3: vm.vm_report.tcb.rtmr3,
                        },
                        certificate: vm.vm_report.certificate,
                    },
                    status: Number(vm.status),
                    codeHash: get().toss.find(tos => tos.operators?.includes(vm.operator))?.codeHash
                });
            }

            set({ vms: fetchedVms });

        } catch (error) {
            console.error('Failed to fetch vms:', error);
        }
    },

    fetchAgents: async () => {
        // TODO: Implement agent fetching logic similar to TOSs and Operators
        set({ agents: [] });
    },

    addTOS: (tos) => {
        set(state => ({ 
            toss: [...state.toss, tos] 
        }));
    },

    addOperator: (operator) => {
        set(state => ({ 
            operators: [...state.operators, operator] 
        }));
    },

    addVm: (vm) => {
        set(state => ({ 
            vms: [...state.vms, vm] 
        }));
    },

    addAgent: (agent) => {
        set(state => ({ 
            agents: [...state.agents, agent] 
        }));
    },

    initializeStore: async () => {
        await get().fetchOperators();
        await get().fetchTOSs();
        await get().fetchVms();
        await get().fetchAgents();
    },
}));

// Utility hook to get a specific TOS by ID
export const useGetTOSById = (id: string) => {
    const toss = useBlockchainStore(state => state.toss);
    return toss.find(tos => tos.id === id);
};

// Utility hook to get a specific Operator by ID
export const useGetOperatorById = (id: string) => {
    const operators = useBlockchainStore(state => state.operators);
    return operators.find(operator => operator.id === id);
};
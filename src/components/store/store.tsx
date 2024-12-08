import { ethers } from 'ethers';
import { create } from 'zustand';
import { createContractInstance } from '../../request/vm';
import { TOS, Operator, Vm, Agent } from '../../data/define';
import { TosStatus } from '../../data/define';
import { MOCK_TOS, MOCK_OPERATORS, MOCK_VMs } from '../../data/mockData';

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
    
    // Add methods
    addTOS: (tos: TOS) => void;
    addOperator: (operator: Operator) => void;
    addVm: (vm: Vm) => void;
    
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
                    labels: tos.labels || [],
                    vm_types: tos.vtypes || [],
                    operator_minimum: Number(tos.operator_minimum),
                    creator: {
                        address: tos.creater,
                        name: tos.creater_name || 'Unknown',
                        logo: tos.creater_logo || DEFAULT_CREATOR_LOGO
                    },
                    vcpus: Number(tos.vcpus),
                    vmemory: Number(tos.vmemory),
                    disk: Number(tos.disk),
                    version: tos.version || '0.1',
                    code: ethers.hexlify(tos.code), // Convert bytes to hex
                    code_hash: tos.code_hash,
                    dao: tos.dao || ethers.ZeroAddress,
                    status: Number(tos.status) === 0 ? TosStatus.Waiting : TosStatus.Active,
                    restaked: Number(tos.restaked) || 0,
                    cert: tos.cert,
                    address: tos.addr
                });
            }

            const allTOS = [...MOCK_TOS, ...fetchedTOSs];
            
            set({ toss: allTOS });
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
                        labels: op.labels || [],
                        owner: {
                            address: op.owner,
                            name: op.owner_name || 'Unknown',
                            logo: op.owner_logo || DEFAULT_OPERATOR_OWNER_LOGO
                        },
                        location: op.location || '',
                        domain: op.domain || '',
                        port: Number(op.port),
                        // Convert TOS IDs to string array
                        vm_ids: {},  // TODO: Calculate here
                });
            }

            const allOperators = [...MOCK_OPERATORS, ...fetchedOperators];
            
            set({ operators: allOperators });
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
                // Add null checks for vm.report and its nested objects
                const vmReport = vm?.report || {};
                const tosInfo = vmReport?.tos_info || {};
                const tcbInfo = vmReport?.tcb_info || {};
                const quote = vmReport?.quote || {};
    
                const new_vm = {
                    id: vm.id,
                    type: vm.type,
                    tos_id: vm.tos_id,
                    operator_id: vm.operator_id,
                    report: {
                        tos_info: {
                            code_hash: tosInfo.code_hash || '',
                            ca_cert_hash: tosInfo.ca_cert_hash || '',
                        },
                        tcb_info: {
                            roots_hash: tcbInfo.roots_hash || '',
                            mrtd: tcbInfo.mrtd || '',
                            rtmr0: tcbInfo.rtmr0 || '',
                            rtmr1: tcbInfo.rtmr1 || '',
                            rtmr2: tcbInfo.rtmr2 || '',
                            rtmr3: tcbInfo.rtmr3 || '',
                        },
                        quote: {
                            type: quote.type || '',
                            cpu_svn: quote.cpu_svn || '',
                            tcb_hash: quote.tcb_hash || '',
                            td_info_hash: quote.td_info_hash || '',
                            report_data: quote.report_data || '',
                            signature: quote.signature || '',
                        }
                    },
                    status: Number(vm.status),
                    code_hash: vm.code_hash
                }

                fetchedVms.push(new_vm);

            }

            const allVms = [...MOCK_VMs, ...fetchedVms];

            for (let i = 0; i < allVms.length; i++) {
                const vm = allVms[i];
                const tos = get().toss.find(t => t.id === vm.tos_id);
                const operator = get().operators.find(op => op.id === vm.operator_id);
                if (tos) {
                    if (!tos.vm_ids) tos.vm_ids = {};
                    tos.vm_ids[vm.operator_id] = tos.vm_ids[vm.operator_id] || [];
                    tos.vm_ids[vm.operator_id].push(vm.id);
                }
                if (operator) {
                    if (!operator.vm_ids) operator.vm_ids = {};
                    operator.vm_ids[vm.tos_id] = operator.vm_ids[vm.tos_id] || [];
                    operator.vm_ids[vm.tos_id].push(vm.id);
                }
            }

            set({ vms: allVms });

        } catch (error) {
            console.error('Failed to fetch vms:', error);
        }
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
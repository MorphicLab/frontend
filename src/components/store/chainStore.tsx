import { ethers } from 'ethers';
import { create } from 'zustand';
import { createContractInstance } from '../../request/vm';
import { TOS, Operator, Vm, Agent, VmStatus } from '../../data/define';
import { TosStatus } from '../../data/define';
import { MOCK_TOS, MOCK_OPERATORS, MOCK_VMs } from '../../data/mockData';
import { DEFAULT_RESTAKE_ETH_AMOUNT } from '../../data/constant';

// Define the store state interface
interface BlockchainStore {
    toss: TOS[];
    operators: Operator[];
    vms: Vm[];
    agents: Agent[];
    ethPrice: number;  // ETH 价格（美元）

    // Fetch methods
    fetchTOSs: () => Promise<void>;
    fetchOperators: () => Promise<void>;
    fetchVms: () => Promise<void>;
    fetchEthPrice: () => Promise<void>;

    // add data
    addTOS: (tos: TOS) => void;
    addOperator: (operator: Operator) => void;
    addVm: (vm: Vm) => void;
    addAgent: (agent: Agent) => void;

    // Initialize store
    initializeStore: () => Promise<void>;

    // Add chart data storage
    tosChartData: {
        [tosId: string]: {
            restaking: {
                labels: string[];
                datasets: {
                    label: string;
                    data: number[];
                    borderColor: string;
                    backgroundColor: string;
                    fill: boolean;
                    tension: number;
                }[];
            };
            tokenDistribution: {
                labels: string[];
                datasets: {
                    label: string;
                    data: number[];
                    borderColor: string;
                    backgroundColor: string;
                    fill: boolean;
                    tension: number;
                }[];
            };
            operatorGrowth: {
                labels: string[];
                datasets: {
                    label: string;
                    data: number[];
                    borderColor: string;
                    backgroundColor: string;
                    fill: boolean;
                    tension: number;
                }[];
            };
        };
    };
    generateTosChartData: (tosId: string) => void;
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
    ethPrice: 2200,  // 默认 ETH 价格
    tosChartData: {},

    fetchTOSs: async () => {
        const fetchedTOSs: TOS[] = [];
        try {
            const contract = await createContractInstance();
            const state = get();

            // Get total number of TOSs
            const totalTOSs = await contract.total_toss();

            // Fetch each TOS
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
                    code: ethers.hexlify(tos.code),
                    code_hash: tos.code_hash,
                    dao: tos.dao || ethers.ZeroAddress,
                    status: Number(tos.status) === 0 ? TosStatus.Waiting : TosStatus.Active,
                    restaked: Number(tos.restaked) || 0,
                    address: tos.addr,
                });
            }


        } catch (error) {
            console.error('Failed to fetch TOSs:', error);
        }

        const allTOS = [...MOCK_TOS, ...fetchedTOSs];
        set({ toss: allTOS });

    },

    fetchOperators: async () => {
        const fetchedOperators: Operator[] = [];

        try {
            const contract = await createContractInstance();

            // Get total number of operators
            const totalOperators = await contract.total_operators();


            // Fetch each operator
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
                });
            }


        } catch (error) {
            console.error('Failed to fetch operators:', error);
        }
        const allOperators = [...MOCK_OPERATORS, ...fetchedOperators];

        set({ operators: allOperators });
    },

    fetchVms: async () => {
        const allToss = get().toss.map(tos => ({ ...tos }));
        const allOperators = get().operators.map(op => ({ ...op }));
        const fetchedVms: Vm[] = [];

        try {
            const contract = await createContractInstance();
            const totalVms = await contract.total_vms();

            for (let i = 0; i < totalVms; i++) {
                const vm = await contract.get_vm_by_index(i);
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
                            pubkey: quote.pubkey || '',
                            address: quote.addr || '',
                            quote: quote.quote || '',
                            event_log: quote.event_log || '',
                        }
                    },
                    status: Number(vm.status) as VmStatus,
                    code_hash: vm.code_hash
                };
                fetchedVms.push(new_vm);
            }

        } catch (error) {

            console.error('Failed to fetch vms:', error);
        }

        let allVms = [] as Vm[];
        allVms = [...MOCK_VMs, ...fetchedVms];

        // 使用新的映射来构建 vm_ids
        const tosVmMap: { [tosId: string]: { [operatorId: string]: string[] } } = {};
        const operatorVmMap: { [operatorId: string]: { [tosId: string]: string[] } } = {};

        // 首先构建映射
        allVms.forEach(vm => {
            // 为 TOS 构建映射
            if (!tosVmMap[vm.tos_id]) {
                tosVmMap[vm.tos_id] = {};
            }
            if (!tosVmMap[vm.tos_id][vm.operator_id]) {
                tosVmMap[vm.tos_id][vm.operator_id] = [];
            }
            tosVmMap[vm.tos_id][vm.operator_id].push(vm.id);

            // 为 Operator 构建映射
            if (!operatorVmMap[vm.operator_id]) {
                operatorVmMap[vm.operator_id] = {};
            }
            if (!operatorVmMap[vm.operator_id][vm.tos_id]) {
                operatorVmMap[vm.operator_id][vm.tos_id] = [];
            }
            operatorVmMap[vm.operator_id][vm.tos_id].push(vm.id);
        });

        // 更新 TOS 对象
        allToss.forEach((tos, index) => {
            // 计算该 TOS 下的所有 VM 数量
            const vmCount = tosVmMap[tos.id]
                ? Object.values(tosVmMap[tos.id]).reduce((total, vms) => total + vms.length, 0)
                : 0;

            allToss[index] = {
                ...tos,
                vm_ids: tosVmMap[tos.id] || {},
                restaked: vmCount * DEFAULT_RESTAKE_ETH_AMOUNT
            };
        });

        // 更新 Operator 对象
        allOperators.forEach((operator, index) => {
            // 计算该运营商下的所有 VM 数量
            const vmCount = operatorVmMap[operator.id]
                ? Object.values(operatorVmMap[operator.id]).reduce((total, vms) => total + vms.length, 0)
                : 0;

            allOperators[index] = {
                ...operator,
                vm_ids: operatorVmMap[operator.id] || {},
                restaked: vmCount * DEFAULT_RESTAKE_ETH_AMOUNT
            };
        });

        // 一次性更新所有状态
        set({
            vms: allVms,
            toss: allToss,
            operators: allOperators
        });
    },

    addTOS: (newTOS: TOS) => {
        MOCK_TOS.push(newTOS);
        set((state) => ({
            toss: [...state.toss, newTOS],
        }));
    },

    addOperator: (newOperator: Operator) => {
        set((state) => ({
            operators: [...state.operators, newOperator],
        }));
    },

    addVm: (newVm: Vm) => {
        MOCK_VMs.push(newVm);

        // update toss and operators
        get().fetchVms();
    },

    addAgent: (newAgent: Agent) => {
        set((state) => ({
            agents: [...state.agents, newAgent],
        }));
    },

    fetchEthPrice: async () => {
        try {
            // 使用 CoinGecko API 获取 ETH 价格
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const data = await response.json();
            const price = data.ethereum.usd;
            set({ ethPrice: price });
        } catch (error) {
            console.error('Failed to fetch ETH price:', error);
        }
    },

    generateTosChartData: (tosId: string) => {
        const state = get();
        if (!state.tosChartData[tosId]) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

            set((state) => ({
                tosChartData: {
                    ...state.tosChartData,
                    [tosId]: {
                        restaking: {
                            labels: months,
                            datasets: [{
                                label: 'Restaking Amount',
                                data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 60 + 40)),
                                borderColor: 'rgb(70, 220, 225)',
                                backgroundColor: 'rgba(70, 220, 225, 0.1)',
                                fill: true,
                                tension: 0.4,
                            }],
                        },
                        tokenDistribution: {
                            labels: months,
                            datasets: [{
                                label: 'Token Distribution',
                                data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 30 + 70)),
                                borderColor: 'rgb(255, 159, 64)',
                                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                                fill: true,
                                tension: 0.4,
                            }],
                        },
                        operatorGrowth: {
                            labels: months,
                            datasets: [{
                                label: 'Active Operators',
                                data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 50 + 30)),
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                                fill: true,
                                tension: 0.4,
                            }],
                        },
                    },
                },
            }));
        }
    },

    initializeStore: async () => {
        try {
            await get().fetchEthPrice();  // 先获取 ETH 价格
            await get().fetchTOSs();
            await get().fetchOperators();
            await get().fetchVms();
        } catch (error) {
            console.error('Failed to initialize store:', error);
        }
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
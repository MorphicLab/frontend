import { assert, ethers } from 'ethers';
import { create } from 'zustand';
import { createContractInstance } from '../../request/vm';
import { TOS, Operator, Vm, VmStatus } from '../../data/define';
import { TosStatus } from '../../data/define';
import { DEFAULT_RESTAKE_ETH_AMOUNT } from '../../data/constant';
import { mockQuote } from '../../tool/quote';
import { MOCK_TOS, MOCK_OPERATORS, MOCK_VMs, MOCK_MORPHIC_AI_VM, MOCK_DEMO_TOS } from '../../data/mockData';

const isMock = import.meta.env.VITE_DATA_MOCK === 'true';

// Define the store state interface
interface BlockchainStore {
    toss: TOS[];
    operators: Operator[];
    vms: Vm[];
    ethPrice: number;  // ETH 价格（美元）

    // Fetch methods
    fetchTOSs: () => Promise<void>;
    fetchOperators: () => Promise<void>;
    fetchVms: () => Promise<void>;
    fetchEthPrice: () => Promise<void>;

    registerTos(newTos: TOS, dockerComposeBytes: Uint8Array): Promise<void>;
    registerOperator(newOperator: Operator): Promise<void>;
    registerVm(newVm: Vm): Promise<void>;

    // add data
    addTos: (tos: TOS) => void;
    addOperator: (operator: Operator) => void;
    addVm: (vm: Vm) => void;

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
    ethPrice: 2200,  // 默认 ETH 价格
    tosChartData: {},

    fetchTOSs: async () => {
        const fetchedTOSs: TOS[] = [];

        if (import.meta.env.VITE_ON_CHAIN_API_MOCK === 'false') {
            try {
                const contract = await createContractInstance();
                const totalTOSs = await contract.total_toss();

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
                        address: isMock ? MOCK_DEMO_TOS.address : tos.addr,
                    });
                }
            } catch (error) {
                console.warn('Failed to fetch TOSs from chain:', error);
            }
        }

        let allTOS = [...fetchedTOSs];
        if (isMock) {
            allTOS = [...allTOS, ...MOCK_TOS];
        }
        set({ toss: allTOS });
    },

    fetchOperators: async () => {
        const fetchedOperators: Operator[] = [];

        if (import.meta.env.VITE_ON_CHAIN_API_MOCK === 'false') {
            try {
                const contract = await createContractInstance();
                const totalOperators = await contract.total_operators();

                for (let i = 0; i < totalOperators; i++) {
                    const operator = await contract.get_operator_by_index(i);
                    fetchedOperators.push({
                        id: operator.id,
                        name: operator.name || 'Unnamed Operator',
                        logo: operator.logo || DEFAULT_OPERATOR_LOGO,
                        description: operator.description || 'No description available',
                        labels: operator.labels || [],
                        location: operator.location || '',
                        domain: operator.domain || '',
                        port: Number(operator.port) || 0,
                        owner: {
                            address: operator.owner,
                            name: operator.owner_name || 'Unknown',
                            logo: operator.owner_logo || DEFAULT_OPERATOR_OWNER_LOGO
                        },
                        restaked: Number(operator.restaked) || 0,
                    });
                }
            } catch (error) {
                console.warn('Failed to fetch operators from chain:', error);
            }
        }

        let allOperators = [...fetchedOperators];
        if (isMock) {
            allOperators = [...allOperators, ...MOCK_OPERATORS];
        }

        set({ operators: allOperators });
    },

    fetchVms: async () => {
        const allToss = get().toss.map(tos => ({ ...tos }));
        const allOperators = get().operators.map(op => ({ ...op }));
        const fetchedVms: Vm[] = [];

        if (import.meta.env.VITE_ON_CHAIN_API_MOCK === 'false') {

            try {
                const contract = await createContractInstance();
                const totalVms = await contract.total_vms();

                for (let i = 0; i < totalVms; i++) {
                    const vm = await contract.get_vm_by_index(i);

                    const new_vm = {
                        id: vm.id,
                        type: vm.vm_type,
                        tos_id: vm.tos_id,
                        operator_id: vm.operator_id,
                        quote: mockQuote,
                        status: Number(vm.status) as VmStatus,
                        code_hash: vm.code_hash,
                        roots_hash: isMock ? MOCK_MORPHIC_AI_VM.roots_hash : vm.roots_hash,
                        cert: isMock ? MOCK_MORPHIC_AI_VM.cert : vm.cert,
                        ca_cert_hash: isMock ? MOCK_MORPHIC_AI_VM.ca_cert_hash : vm.ca_cert_hash,
                    };
                    fetchedVms.push(new_vm);
                }

            } catch (error) {
                console.error('Failed to fetch vms:', error);
            }
        }

        let allVms = [...fetchedVms];
        if (isMock) {
            allVms = [...allVms, ...MOCK_VMs];
        }

        // 使用新的映射来构建 vm_ids
        const tosVmMap: { [tosId: string]: { [operatorId: string]: string[] } } = {};
        const operatorVmMap: { [operatorId: string]: { [tosId: string]: string[] } } = {};

        // 首先构建映射
        allVms.forEach(vm => {
            if (vm.operator_id !== undefined && vm.tos_id !== undefined) {
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
            }
        });

        // 更新 TOS 对象
        allToss.forEach((tos, index) => {
            // 计算该 TOS 下的所有 VM 数量
            const vmCount = tosVmMap[tos.id]
                ? Object.values(tosVmMap[tos.id]).reduce((total, vms) => total + vms.length, 0)
                : 0;

            allToss[index] = {
                ...tos,
                status: vmCount < tos.operator_minimum ? TosStatus.Waiting : TosStatus.Active,
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

    addTos: (newTOS: TOS) => {
        if (isMock) {
            MOCK_TOS.push(newTOS);
        }

        // update toss
        get().fetchTOSs();
        console.log('TOS added successfully');
    },

    addOperator: (newOperator: Operator) => {
        if (isMock) {
            MOCK_OPERATORS.push(newOperator);
        }

        // update operators
        get().fetchOperators();
        console.log('Operator added successfully');
    },

    addVm: (newVm: Vm) => {
        if (isMock) {
            MOCK_VMs.push(newVm);
        }

        // update toss and operators
        get().fetchVms();
        console.log("new vm added successfully");
    },

    fetchEthPrice: async () => {
        let price = 2200;
        try {
            // 使用 CoinGecko API 获取 ETH 价格
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            price = data.ethereum?.usd || price;
        } catch (error) {
            console.warn('Using default ETH price due to fetch error:', error);
        }

        set({ ethPrice: price });
    },

    async registerTos(newTos: TOS, dockerComposeBytes: Uint8Array): Promise<void> {
        try {
            // Get contract instance
            const contract = await createContractInstance();

            console.log('Tos to register: ', newTos);

            const tx = await contract.create_tos(
                newTos.name,
                newTos.logo,
                newTos.website,
                newTos.description,
                newTos.labels,
                newTos.vm_types,
                newTos.operator_minimum,
                newTos.creator.name,
                newTos.creator.logo,
                newTos.vcpus,
                newTos.vmemory,
                newTos.disk,
                newTos.version,
                dockerComposeBytes,
                newTos.dao || ethers.ZeroAddress,
            );

            console.log('Transaction sent:', tx.hash);

            // 等待交易确认
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            console.log('Transaction logs:', receipt.logs);

            alert('TOS registered successfully');

            // refresh tos list
            useBlockchainStore.getState().fetchTOSs();
        } catch (error: any) {
            console.error('Failed to register TOS:', error);
            alert(`Registration failed: ${error.message || 'Unknown error'}`);
        }

    },

    async registerOperator(newOperator: Operator): Promise<void> {
        try {
            // Get contract instance
            const contract = await createContractInstance();

            console.log('Operator info:', newOperator);

            // First register the operator
            const tx = await contract.register_operator(
                newOperator.name,
                newOperator.logo || DEFAULT_OPERATOR_LOGO,
                newOperator.labels,
                newOperator.description,
                contract?.runner?.address || ethers.ZeroAddress, // Use connected wallet as owner
                newOperator.owner.name || '',
                newOperator.owner.logo || DEFAULT_OPERATOR_OWNER_LOGO,
                newOperator.location || '',
                newOperator.domain || '',
                Number(newOperator.port), // Ensure numeric
            );

            // Wait for transaction to be mined
            const receipt = await tx.wait();
            console.log('Operator Registration Transaction Receipt:', receipt);
        } catch (error) {
            console.error('Detailed Registration Error:', error);
            // More detailed error logging
            if (error instanceof Error) {
                console.error('Error Name:', error.name);
                console.error('Error Message:', error.message);

                // If it's an ethers error, log additional details
                if ('reason' in error) {
                    console.error('Ethers Error Reason:', (error as any).reason);
                }
                if ('code' in error) {
                    console.error('Error Code:', (error as any).code);
                }
            }

            // Rethrow or handle the error as needed
            throw error;
        }

        // refresh operator list
        get().fetchOperators();
    },

    async registerVm(newVm: Vm): Promise<void> {
        try {
            // Get contract instance
            const contract = await createContractInstance();

            await contract.register_vm_to_tos(newVm.tos_id, {
                id: newVm.id,
                vm_type: newVm.type,
                tos_id: newVm.tos_id,
                operator_id: newVm.operator_id,
                status: newVm.status,
                code_hash: newVm.code_hash
            }, { gasLimit: 3000000 });
            console.log(`Registered vm ${newVm.id} with operator ${newVm.operator_id} to TOS ${newVm.tos_id}`);
            alert('Operator with a new CVM registered successfully');
        } catch (error) {
            console.error(`Failed to register operator ${newVm.operator_id}:`, error);
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
            await get().fetchEthPrice();  // fetch ETH price first
            console.log('fetching toss');
            await get().fetchTOSs();
            console.log('fetching operators');
            await get().fetchOperators();
            console.log('fetching vms');
            await get().fetchVms();
        } catch (error) {
            console.error('Failed to initialize store:', error);
        }
    },
}));

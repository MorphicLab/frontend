import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

import { 
    TOSStatus,
    TOS,
    Operator, 
    Agent,
} from '../data/define';

// VM合约地址
const VM_CONTRACT_ADDRESS = import.meta.env.VITE_VM_CONTRACT_ADDRESS;

// VM合约ABI
const VM_ABI = [
    "function total_vms() public view returns (uint128)",
    "function get_vm_by_index(uint128 index) public view returns (tuple(address creater, uint16 vcpus, uint16 vmemory, uint64 disk, string name, string version, string description, bytes16[] vm_ids))"
];

export const useVM = () => {
    const [tos, setTOS] = useState<TOS[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!window.ethereum) {
                    throw new Error("Please install MetaMask");
                }
                
                // 连接到以太坊网络
                const provider = new ethers.providers.Web3Provider(window.ethereum as any);
                const vmContract = new ethers.Contract(VM_CONTRACT_ADDRESS, VM_ABI, provider);
                console.log('vmContract:', vmContract);


                // 获取总数
                const totalVms = await vmContract.total_vms();
                console.log('Total VMs:', totalVms);
                
                // 获取所有VM数据
                const vms = [];
                for(let i = 1; i <= totalVms; i++) {
                    const vm = await vmContract.get_vm_by_index(i);
                    vms.push(vm);
                }

                // 转换为TOS格式
                const tosData = vms.map((vm, index) => ({
                    id: index + 1,
                    name: vm.name,
                    logo: '/images/default-logo.png',
                    address: vm.creater,
                    introduction: vm.description,
                    publisher: {
                        name: 'Unknown',
                        logo: '/images/default-publisher.png'
                    },
                    labels: ['Compute'],
                    restaked: '0',
                    operators: vm.vm_ids.length,
                    stakers: '0',
                    likes: '0',
                    status: 'active' as TOSStatus,
                    codeHash: ''
                }));

                

                setTOS(tosData);
                setOperators([]);
                setAgents([]);

            } catch (error) {
                console.error("Failed to fetch data from VM contract:", error);
                setTOS([]);
                setOperators([]);
                setAgents([]);
            }
        };

        fetchData();
    }, []);

    return {
        tos,
        operators,
        agents
    };
};
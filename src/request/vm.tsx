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
    "function total_toss() public view returns (uint128)",
    "function get_tos(bytes16 id) external view returns (tuple(bytes16 id, string name, string logo, string website, string description, address creater, uint16 vcpus, uint16 vmemory, uint64 disk, string version, bytes code, bytes20[] vm_ids, uint8 status))"
];

function useVM() {
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
                const provider = new ethers.BrowserProvider(window.ethereum);
                const vmContract = new ethers.Contract(VM_CONTRACT_ADDRESS, VM_ABI, provider);
                console.log('vmContract:', vmContract);


                // 获取总数
                const totalTos = await vmContract.total_toss();
                console.log('Total TOS:', totalTos);
                
                // 获取所有TOS数据
                const tosItems = [];
                for(let i = 1; i <= totalTos; i++) {
                    // 正确转换为 bytes16 格式
                    const tosId = ethers.zeroPadValue(ethers.toBeHex(i), 16);
                    const tos = await vmContract.get_tos(tosId);
                    tosItems.push(tos);
                }

                // 转换为前端 TOS 格式
                const tosData = tosItems.map((tos) => ({
                    id: Number(tos.id),  // 转换为数字格式，以匹配路由参数期望的格式
                    name: tos.name || 'Unnamed Service',
                    logo: tos.logo || '/images/morphic-logo-sm.png',
                    website: tos.website || '',
                    description: tos.description || 'No description available',
                    creator: {
                        address: tos.creater,
                        name: 'Unknown',
                        logo: '/images/morphic-logo-sm.png'
                    },
                    vcpus: Number(tos.vcpus),
                    vmemory: Number(tos.vmemory),
                    disk: Number(tos.disk),
                    version: tos.version || '1.0.0',
                    code: ethers.hexlify(tos.code),
                    labels: [],  // 从其他地方获取或推断
                    restaked: '0',
                    operators: tos.vm_ids.length,
                    stakers: '0',
                    likes: '0',
                    status: tos.status === 0 ? 'waiting' : 'active',
                    codeHash: ethers.keccak256(tos.code),
                    dao: tos.creater  // 使用创建者地址作为 dao 地址
                }));

                console.log('Processed TOS data:', tosData);
                setTOS(tosData);
                setOperators([]);
                setAgents([]);

            } catch (error) {
                console.error("Failed to fetch data from TOS contract:", error);
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
}

export { useVM };
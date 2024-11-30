import { create } from 'zustand';
import { TOS } from '../data/define';
import { ethers } from 'ethers';

// TOS 注册合约 ABI
const TOS_REGISTRY_ABI = [
    "function get_tos(bytes16 id) external view returns (tuple(bytes16 id, string name, string logo, string website, string description, address creater, uint16 vcpus, uint16 vmemory, uint64 disk, string version, bytes code, bytes20[] vm_ids, uint8 status))"
];

interface TOSStore {
    registeredTOS: TOS[];
    addTOS: (tos: TOS) => void;
    fetchTOSById: (index: number) => Promise<void>;
    getAllTOS: () => TOS[];
}

export const useTOSStore = create<TOSStore>((set, get) => ({
    registeredTOS: [],

    addTOS: (tos: TOS) => {
        set(state => ({
            registeredTOS: [...state.registeredTOS, tos]
        }));
    },

    fetchTOSById: async (index: number) => {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask not installed');
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(
                import.meta.env.VITE_VM_CONTRACT_ADDRESS,
                TOS_REGISTRY_ABI,
                provider
            );

            // 将 index 转换为 bytes16 格式
            const bytes16Id = ethers.zeroPadValue(ethers.toBeHex(index), 16);
            
            // 从合约获取 TOS 信息
            const tosData = await contract.get_tos(bytes16Id);

            // 将合约返回的数据转换为前端使用的 TOS 格式
            const tos: TOS = {
                id: tosData.id,
                name: tosData.name,
                logo: tosData.logo,
                dao: '',  // 使用创建者地址作为 dao 地址
                website: tosData.website,
                description: tosData.description,
                creator: {
                    address: tosData.creater,
                    name: 'Unknown',  // 这里可能需要从其他地方获取创建者信息
                    logo: '/images/morphic-logo-sm.png'  // 默认 logo
                },
                vcpus: Number(tosData.vcpus),
                vmemory: Number(tosData.vmemory),
                disk: Number(tosData.disk),
                version: tosData.version,
                code: ethers.hexlify(tosData.code),
                labels: [],  // 这个信息需要从其他地方获取或推断
                restaked: 0,  // 这些信息需要从其他合约或服务获取
                operators: tosData.vm_ids.length,
                stakers: 0,
                likes: 0,
                status: tosData.status === 0 ? 'waiting' : 'active',
                txHash: '',  // 这个信息需要从交易中获取
                codeHash: ethers.keccak256(tosData.code)  // 计算代码的哈希值
            };

            // 添加到 store
            get().addTOS(tos);

        } catch (error) {
            console.error('Failed to fetch TOS:', error);
            throw error;
        }
    },

    getAllTOS: () => {
        const { registeredTOS } = get();
        return [...registeredTOS];
    },
})); 
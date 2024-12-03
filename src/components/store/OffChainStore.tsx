import { create } from 'zustand';
import { getAgentListByOwner } from '../../request/operator'; // 导入获取代理列表的接口

// 定义 OffChainStore 状态接口
interface OffChainStore {
    agents: any[]; // 根据实际类型替换 any
    fetchAgents: () => Promise<void>;
    initializeStore: () => Promise<void>;
}

// 创建 OffChainStore
export const useOffChainStore = create<OffChainStore>((set) => ({
    agents: [],
    fetchAgents: async () => {
        try {
            const owner = window.ethereum?.selectedAddress || '';
            const agents = await getAgentListByOwner(owner); 
            set({ agents });
        } catch (error) {
            console.error('failed to get agent list:', error);
        }
    },

    initializeStore: async () => {
        await useOffChainStore.getState().fetchAgents();
    },
}));
import { create } from 'zustand';
import { getAgentListByOwner } from '../../request/operator'; // 导入获取代理列表的接口
import { Operator } from '../../data/define';
import { useBlockchainStore } from '../../components/store/store';

// 定义 OffChainStore 状态接口
interface OffChainStore {
    agents: any[];
    myAgents: any[];
    fetchAgents: (allOperators: Operator[]) => Promise<void>;
    fetchMyAgents: (myOperators: Operator[]) => Promise<void>;

    initializeStore: (allOperators: Operator[], myOperators: Operator[]) => Promise<void>;
}



// 创建 OffChainStore
export const useOffChainStore = create<OffChainStore>((set) => ({
    agents: [],
    fetchAgents: async (allOperators: Operator[]) => {
        // TODO：防止循环请求的bug造成大量压力，暂时注释，修复后再补充
    },
    myAgents: [],
    fetchMyAgents: async (myOperators: Operator[]) => {
        try {
            const myAgents = await getAgentListByOwner(myOperators[0].domain, myOperators[0].port); 
            set({ myAgents });
            
        } catch (error) {
            console.error('failed to get agent list:', error);
        }
    },

    initializeStore: async (allOperators: Operator[], myOperators: Operator[]) => {
        await useOffChainStore.getState().fetchMyAgents(myOperators);
        await useOffChainStore.getState().fetchAgents(allOperators);
    },
}));
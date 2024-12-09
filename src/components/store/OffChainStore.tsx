import { create } from 'zustand';
import { getAgentListByOwner } from '../../request/operator'; // 导入获取代理列表的接口
import { Operator } from '../../data/define';

// 定义 OffChainStore 状态接口
interface OffChainStore {
    allAgents: any[];
    myAgents: any[];
    fetchAgents: (allOperators: Operator[]) => Promise<void>;
    fetchMyAgents: (myOperators: Operator[]) => Promise<void>;

    initializeStore: (allOperators: Operator[], myOperators: Operator[]) => Promise<void>;
}



// 创建 OffChainStore
export const useOffChainStore = create<OffChainStore>((set) => ({
    allAgents: [],
    fetchAgents: async (allOperators: Operator[]) => {
        console.log("fetchAllAgents", allOperators);
        try {
            const allAgents = [];
            for (const operator of allOperators) {
                const ags = await getAgentListByOwner(operator.domain, operator.port);
                allAgents.push(...ags);
            }
            set({ allAgents });
            
        } catch (error) {
            console.error('failed to get agent list:', error);
        }
    },
    myAgents: [],
    fetchMyAgents: async (myOperators: Operator[]) => {
        console.log("fetchMyAgents", myOperators);
        try {
            const myAgents = [];
            for (const operator of myOperators) {
                const ags = await getAgentListByOwner(operator.domain, operator.port);
                myAgents.push(...ags);
            }
            set({ myAgents });
            
        } catch (error) {
            console.error('failed to get agent list:', error);
        }
    },

    initializeStore: async (allOperators: Operator[], myOperators: Operator[]) => {
        await useOffChainStore.getState().fetchMyAgents(myOperators);
        // await useOffChainStore.getState().fetchAgents(allOperators);
    },
}));
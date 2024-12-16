import { create } from 'zustand';
import { getAgentListByOperator } from '../../request/operator';
import { getQuoteList } from '../../request/quote';
import { Operator, Agent, Vm } from '../../data/define';
import { MOCK_AGENTS } from '../../data/mockData';
import { getMorphicAiOperators } from '../../tool/morphic';

// 定义 OffChainStore 状态接口
interface OffChainStore {
    allAgents: Agent[];
    myAgents: Agent[];
    quotes: Vm[];
    addAgent: (newAgent: Agent) => void;
    fetchAgents: (morphiAiOperator: Operator) => Promise<void>;
    fetchQuotes: () => Promise<void>;

    initializeStore: (morphicAiOperators: Operator[], myMorphicAiOperators: Operator[]) => Promise<void>;
}

const isMock = import.meta.env.VITE_DATA_MOCK === 'true';

// 创建 OffChainStore
export const useOffChainStore = create<OffChainStore>((set) => ({
    allAgents: [],
    myAgents: [],
    quotes: [],


    fetchAgents: async (morphiAiOperator: Operator) => {
        try {
            let allAgents: Agent[] = [];

            const fetchedAgents: Agent[] = [];
            const ags = await getAgentListByOperator(morphiAiOperator.domain);
            fetchedAgents.push(...ags);
            if (isMock) {
                allAgents = [...MOCK_AGENTS, ...fetchedAgents];
            } else {
                allAgents = fetchedAgents;
            }

            const myAgents = allAgents.filter(agent => agent.owner === morphiAiOperator.owner.address);
            
            set({ allAgents, myAgents });
            
        } catch (error) {
            console.error('failed to get agent list:', error);
        }
    },

    addAgent: (newAgent: Agent) => {
        if (isMock) {
            MOCK_AGENTS.push(newAgent);
        }
    },
    
    
    fetchQuotes: async () => {
        try {
            const quotes = await getQuoteList();
            set({ quotes });
            
        } catch (error) {
            console.error('failed to get quote list:', error);
        }
    },

    initializeStore: async (morphicAiOperators: Operator[], myMorphicAiOperators: Operator[]) => {
        // TODO: should allow to fetch agents from any operator in the future
        if (myMorphicAiOperators.length > 0) {
            await useOffChainStore.getState().fetchAgents(myMorphicAiOperators[0]);
        }
        await useOffChainStore.getState().fetchQuotes();
    },
}));
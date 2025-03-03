import { create } from 'zustand';
import { getAgentListByOperator } from '../../request/operator';
import { getQuoteList } from '../../request/quote';
import { Operator, Agent, Vm } from '../../data/define';
import { MOCK_AGENTS } from '../../data/mockData';

// 定义 OffChainStore 状态接口
interface OffChainStore {
    allAgents: Agent[];
    myAgents: Agent[];
    quotes: Vm[];
    addAgent: (newAgent: Agent) => void;
    fetchAgents: (morphiAiOperator: Operator) => Promise<void>;
    fetchQuotes: (morphiAiOperator: Operator) => Promise<void>;

    initializeStore: (morphicAiOperators: Operator[]) => Promise<void>;
}

const isMock = import.meta.env.VITE_DATA_MOCK === 'true';

// Create OffChainStore
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

            const myAgents = allAgents.filter(agent => agent.owner.toLowerCase() === morphiAiOperator.owner.address.toLowerCase());
            
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
    
    
    fetchQuotes: async (morphiAiOperator: Operator) => {
        try {
            const quotes = await getQuoteList(morphiAiOperator.domain, morphiAiOperator.port);
            set({ quotes });
            
        } catch (error) {
            console.warn('failed to get quote list:', error);
        }
    },

    initializeStore: async (morphicAiOperators: Operator[]) => {
        if (morphicAiOperators.length > 0) {
            await useOffChainStore.getState().fetchAgents(morphicAiOperators[0]);
            await useOffChainStore.getState().fetchQuotes(morphicAiOperators[0]);
        } else {
            console.warn('No Morphic AI operators found');
        }
    },
}));

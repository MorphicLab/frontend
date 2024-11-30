import { create } from 'zustand';
import { TOS } from '../data/define';
import { useVM } from '../request/vm';

interface TOSStore {
    registeredTOS: TOS[];
    setTOS: (tos: TOS[]) => void;
    addTOS: (tos: TOS) => void;
    getAllTOS: () => TOS[];
}

export const useTOSStore = create<TOSStore>((set, get) => ({
    registeredTOS: [],

    setTOS: (tos: TOS[]) => {
        set({ registeredTOS: tos });
    },

    addTOS: (tos: TOS) => {
        set(state => ({
            registeredTOS: [...state.registeredTOS, tos]
        }));
    },

    getAllTOS: () => {
        const { registeredTOS } = get();
        return [...registeredTOS];
    },
})); 
import { Agent } from '../data/define';

// 部署agent到operator的接口
export async function deployAgent(domain: string, port: number, agent: Agent): Promise<boolean> {
    if (import.meta.env.VITE_OFF_CHAIN_API_MOCK == true) {
        return true; // for test
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(`http://${domain}:${port}/api/v1/deploy_agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain,
                port,
                agent
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('failed to deploy agent');
        }

        const data = await response.json();
        return data.err_code === 0;
    } catch (error) {
        console.error('failed to deploy agent:', error);
        return false;
    }
}

// 根据用户获取agent列表的接口
export async function getAgentListByOwner(owner: string): Promise<Agent[]> {
    if (import.meta.env.VITE_OFF_CHAIN_API_MOCK) {
        return [
            {
                id: 1,
                owner: window.ethereum?.selectedAddress || '',
                name: 'Mock Agent 1',
                description: 'This is a mock agent for testing purposes.',
                logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztncnxOUnTY_sw5t0_sFSYVJyXYXuPD6Ztg&s',
                labels: ['mock', 'test'],
                users: '0',
                rating: 0,
                status: 'offline',
                modelType: 'GPT-4',
                memoryRequirement: '2GB',
                storageRequirement: '200GB',
                daoContract: '0xMockDAOContractAddress'
            }
        ];
    }
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(`/api/v1/getAgentListByOwner?owner=${owner}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('failed to get agent list by owner');
        }

        const data = await response.json();
        return data as Agent[];
    } catch (error) {
        console.error('failed to get agent list by user:', error);
        return [];
    }
}

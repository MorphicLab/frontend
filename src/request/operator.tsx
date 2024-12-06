import { Agent } from '../data/define';


// 部署agent到operator的接口
export async function deployAgent(agent: Agent, operatorDomain: string, operatorPort: number, dockerCompose: string): Promise<boolean> {
    if (import.meta.env.VITE_OFF_CHAIN_API_MOCK == true) {
        return true; // for test
    }

    try {
        const response = await fetch(`http://${operatorDomain}:${operatorPort}/prpc/Teepod.CreateVm?json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: agent.name,
                image: 'dstack-dev-0.3.0',
                compose_file: dockerCompose,
                vcpu: 1,
                memory: 1024,
                disk_size: 20,
                ports: [],
                features: {
                    kms: true,
                    tproxy: true
                }
            }),
        });

        if (!response.ok) {
            throw new Error('failed to deploy agent');
        }
        return true;
    } catch (error) {
        console.error('failed to deploy agent:', error);
        return false;
    }
}

// 根据用户获取agent列表的接口
export async function getAgentListByOwner(operatorDomain: string, operatorPort: number): Promise<Agent[]> {
    console.log("req operator getAgentListByOwner", operatorDomain, operatorPort);
    if (import.meta.env.VITE_OFF_CHAIN_API_MOCK == 'true') {
        return [
            {
                id: 1,
                owner: window.ethereum?.selectedAddress || '',
                name: 'Mock Agent 1',
                description: 'This is a mock agent for testing purposes.',
                readme: '',
                logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztncnxOUnTY_sw5t0_sFSYVJyXYXuPD6Ztg&s',
                labels: ['mock', 'test'],
                users: '0',
                rating: 0,
                status: 'offline',
                modelType: 'GPT-4',
                memoryRequirement: '2GB',
                storageRequirement: '200GB',
                daoContract: '0xMockDAOContractAddress',
                visibility: 'public',
                dockerCompose: '',
            }
        ];
    }
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        const response = await fetch(`http://${operatorDomain}:${operatorPort}/prpc/Teepod.Status?json`, {
            method: 'POST',
            headers,
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        const data = await response.json();
        const agents = data.vms.map((vm: { id: string; name: string; status: string; configuration: { memory: number; disk_size: number } }) => ({
            id: vm.id,
            owner: '',
            name: vm.name,
            description: '',
            readme: '',
            logo: '',
            labels: [],
            users: '0',
            rating: 0,
            status: vm.status,
            modelType: '',
            memoryRequirement: `${vm.configuration.memory}MB`,
            storageRequirement: `${vm.configuration.disk_size}GB`,
            daoContract: '',
            visibility: ''
        }));
        
        return agents;

    } catch (error) {
        console.error('failed to get agent list by user:', error);
        return [];
    }
}

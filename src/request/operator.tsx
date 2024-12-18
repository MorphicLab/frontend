import { Agent, AgentStatus } from '../data/define';
import { MOCK_MORPHIC_AGENT } from '../data/mockData.ts';
import { useOffChainStore } from '../components/store/offChainStore.tsx';

const AGENT_PREFIX = 'agent-';
const VM_MANAGEMENT_CONSOLE_PORT = 33001;

// 处理dockerCompose格式的函数
function formatDockerCompose(name :string, content: string): string {
    return JSON.stringify({ 
        "manifest_version": 1,
        name: name,
        "version": "1.0.0",
        "features": ["kms", "tproxy-net"],
        "runner": "docker-compose",
        docker_compose_file: content 
    });
}


// 部署agent到operator的接口
export async function deployAgent(agent: Agent, operatorDomain: string, docker_compose: string): Promise<boolean> {
    if (import.meta.env.VITE_OFF_CHAIN_API_MOCK === 'true') {
        const { addAgent } = useOffChainStore.getState();
        addAgent(agent);
        return true;    // for test
    }

    try {
        const response = await fetch(`http://${operatorDomain}:${VM_MANAGEMENT_CONSOLE_PORT}/prpc/Teepod.CreateVm?json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: AGENT_PREFIX + agent.name,
                image: 'dstack-dev-0.3.2',
                compose_file: formatDockerCompose(AGENT_PREFIX + agent.name, docker_compose),
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
export async function getAgentListByOperator(operatorDomain: string): Promise<Agent[]> {
    if (import.meta.env.VITE_OFF_CHAIN_API_MOCK === 'true') {
        return [
            {
                id: '1',
                owner: window.ethereum?.selectedAddress || '',
                name: 'Chat Agent',
                description: 'This is a mock agent for testing purposes.',
                readme: '',
                logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztncnxOUnTY_sw5t0_sFSYVJyXYXuPD6Ztg&s',
                labels: ['Chat'],
                users: 0,
                rating: 0,
                status: AgentStatus.Offline,
                model_type: 'GPT-4',
                memory_requirement: '2GB',
                storage_requirement: '200GB',
                dao_contract: '0xMockDAOContractAddress',
                visibility: 'private',
                docker_compose: '',
            }
        ];
    }
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        const response = await fetch(`http://${operatorDomain}:${VM_MANAGEMENT_CONSOLE_PORT}/prpc/Teepod.Status?json`, {
            method: 'GET',
            headers
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        const data = await response.json();
        const agents = data.vms
            .filter((vm: { name: string }) => vm.name.startsWith(AGENT_PREFIX)) // 用于区分后台的agent实例
            .map((vm: { id: string; instance_id: string; name: string; status: string; configuration: { memory: number; disk_size: number } }) => ({
                id: vm.id,
                instance_id: vm.instance_id,
                owner: window.ethereum?.selectedAddress || '',
                name: vm.name.replace('agent-', ''),
                description: MOCK_MORPHIC_AGENT.description,
                readme: '',
                logo: MOCK_MORPHIC_AGENT.logo,
                labels: MOCK_MORPHIC_AGENT.labels,
                users: 0,
                rating: 0,
                status: vm.status,
                model_type: MOCK_MORPHIC_AGENT.model_type,
                memory_requirement: `${vm.configuration.memory}MB`,
                storage_requirement: `${vm.configuration.disk_size}GB`,
                dao_contract: MOCK_MORPHIC_AGENT.dao_contract,
                visibility: MOCK_MORPHIC_AGENT.visibility,
            }));
        return agents;

    } catch (error) {
        console.error('failed to get agent list by user:', error);
        return [];
    }
}

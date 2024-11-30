import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { Operator, Agent, TOS, TOSStatus } from '../data/define';
import { useTOSStore } from '../store/tosStore';

const VM_CONTRACT_ADDRESS = import.meta.env.VITE_VM_CONTRACT_ADDRESS;

// VM合约ABI
const VM_ABI = [
    "function create_tos(string calldata name, string calldata logo, string calldata website, string calldata description, string[] calldata operator_types, string calldata creater_name, string calldata creater_logo, uint8 operator_minimum, uint16 vcpus, uint16 vmemory, uint64 disk, string calldata version, bytes memory code, string[] calldata labels, address dao) external returns(bytes16)",
    "function total_toss() public view returns (uint256)",
    "function get_tos_by_index(uint256 index) external view returns (tuple(bytes16 id, string name, string logo, string website, string description, string[] operator_types, address creater, string creater_name, string creater_logo, uint8 operator_minimum, uint16 vcpus, uint16 vmemory, uint64 disk, string version, bytes code, string[] labels, address dao, address[] operators, bytes20[] vm_ids, uint8 status))",
    "function registered_toss() public view returns (bytes16[] memory)"  // Keep for backward compatibility
];

const DEFAULT_TOS_LOGO = '/images/morphic-logo-sm.png';
const DEFAULT_CREATOR_LOGO = '/images/morphic-logo-sm.png';

function useVM() {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const { setTOS, registeredTOS } = useTOSStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!window.ethereum) {
                    throw new Error("Please install MetaMask");
                }
                
                const provider = new ethers.BrowserProvider(window.ethereum);
                const vmContract = new ethers.Contract(
                    VM_CONTRACT_ADDRESS,
                    VM_ABI,
                    provider
                );

                // 获取所有注册的 TOS ID
                let tosCount = 0;
                try {
                    // Get the total number of TOS
                    tosCount = await vmContract.total_toss();
                    console.log('Registered TOS Count:', tosCount);

                    // If no TOS are registered, skip further processing
                    if (tosCount === 0) {
                        console.warn('No TOS registered yet');
                        setTOS([]);  // Set empty array
                        return;
                    }
                } catch (idsError) {
                    console.error('Failed to fetch TOS Count:', idsError);
                    
                    // Log additional context for debugging
                    console.error('Contract Address:', VM_CONTRACT_ADDRESS);
                    console.error('Full Error:', idsError);
                    
                    // Set empty array if fetching fails
                    setTOS([]);
                    return;
                }
                
                // 获取所有TOS数据
                const tosItems = [];
                for (let i = 0; i < tosCount; i++) {
                    try {
                        console.log(`Fetching TOS at index: ${i}`);  // Log the index being fetched
                        
                        const tos = await vmContract.get_tos_by_index(i);
                        
                        // Validate the returned TOS data
                        if (!tos || !tos.id) {
                            console.warn(`Invalid TOS data at index: ${i}`);
                            continue;
                        }

                        console.log(`Fetched TOS at index ${i}:`, tos);
                        
                        tosItems.push(tos);
                    } catch (err) {
                        console.warn(`Failed to fetch TOS at index ${i}:`, err);
                        continue;
                    }
                }

                // 转换为前端 TOS 格式
                const tosData: TOS[] = tosItems.map((tos) => ({
                    id: tos.id,
                    name: tos.name || 'Unnamed Service',
                    logo: tos.logo || DEFAULT_TOS_LOGO,
                    website: tos.website || '',
                    description: tos.description || 'No description available',
                    operatorTypes: tos.operator_types || [],
                    creator: {
                        address: tos.creater,
                        name: tos.creater_name || 'Unknown',
                        logo: tos.creator_logo || DEFAULT_CREATOR_LOGO
                    },
                    operatorMinimum: Number(tos.operator_minimum),
                    vcpus: Number(tos.vcpus),
                    vmemory: Number(tos.vmemory),
                    disk: Number(tos.disk),
                    version: tos.version || '0.1',
                    code: ethers.hexlify(tos.code),
                    labels: tos.labels || [],
                    dao: tos.dao || ethers.ZeroAddress,
                    operators: tos.operators || [], // ignore the vm id here
                    vms: tos.vm_ids || [],
                    // Fix status conversion: 0 = Waiting, 1 = Active
                    status: Number(tos.status) === 0 ? 'waiting' : 'active' as TOSStatus,
                    restaked: 0,  // TODO: Get from contract
                    stakers: 0,   // TODO: Get from contract
                    likes: 0,     // TODO: Get from contract
                    codeHash: ethers.keccak256(tos.code),
                }));

                // 更新 store
                setTOS(tosData);

            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Ensure store is set to empty array in case of total failure
                setTOS([]);
            }
        };

        fetchData();
    }, []);

    const fetchTOSById = async (id: number) => {
        try {
            const tosId = ethers.zeroPadValue(ethers.toBeHex(id), 16);
            const tos = registeredTOS.find(tos => tos.id === tosId);
            return { tos };
        } catch (error) {
            console.error("Failed to fetch TOS:", error);
            throw error;
        }
    };

    return {
        tos: useTOSStore(state => state.registeredTOS),
        operators,
        agents,
        fetchTOSById
    };
}

export { useVM, VM_CONTRACT_ADDRESS, VM_ABI };
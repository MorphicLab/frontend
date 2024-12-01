import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { Operator, Agent, TOS, TOSStatus } from '../data/define';

const VM_CONTRACT_ADDRESS = import.meta.env.VITE_VM_CONTRACT_ADDRESS;

// VM合约ABI
const VM_ABI = [
    // TOS related functions
    "function create_tos(string calldata name, string calldata logo, string calldata website, string calldata description, string[] calldata operator_types, string calldata creater_name, string calldata creater_logo, uint8 operator_minimum, uint16 vcpus, uint16 vmemory, uint64 disk, string calldata version, bytes memory code, string[] calldata labels, address dao) external returns(bytes16)",
    "function total_toss() public view returns (uint256)",
    "function get_tos_by_index(uint256 index) external view returns (tuple(bytes16 id, string name, string logo, string website, string description, string[] operator_types, address creater, string creater_name, string creater_logo, uint8 operator_minimum, uint16 vcpus, uint16 vmemory, uint64 disk, string version, bytes code, string[] labels, address dao, address[] operator_ids, uint8 status))",
    // Operator related functions
    "function total_operators() public view returns (uint256)",
    "function get_operator_by_index(uint256 index) public view returns (tuple(address id, string name, string logo, string[] operator_types, address owner, string owner_name, string owner_logo, string location, uint256 create_time, string domain, uint64 port, address[] staker_ids, bytes16[] tos_ids))",
    "function register_operator_to_tos(bytes16 tos_id, address operator_id) public",
    "function register_operator(string name, string logo, string[] operator_types, address owner, string owner_name, string owner_logo, string location, string domain, uint64 port, bytes16 tos_id) external",
];

const DEFAULT_TOS_LOGO = '/images/morphic-logo-sm.png';
const DEFAULT_CREATOR_LOGO = '/images/morphic-logo-sm.png';

function useVM() {
    const [toss, setTOS] = useState<TOS[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    // const { setTOS } = useTOSStore();

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

                // Fetch all registered TOS
                const tosCount = await vmContract.total_toss();
                console.log('Registered TOS Count:', tosCount);

                if (tosCount === 0) {
                    console.warn('No TOS registered yet');
                    setTOS([]);
                    return;
                }

                const tosPromises = Array.from({ length: Number(tosCount) }, (_, i) => 
                    vmContract.get_tos_by_index(i)
                );

                const tosItems = await Promise.all(tosPromises);
                console.log('Fetched TOS items:', tosItems);

                // Convert contract TOS data to frontend format
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
                        logo: tos.creater_logo || DEFAULT_CREATOR_LOGO
                    },
                    operatorMinimum: Number(tos.operator_minimum),
                    vcpus: Number(tos.vcpus),
                    vmemory: Number(tos.vmemory),
                    disk: Number(tos.disk),
                    version: tos.version || '0.1',
                    code: ethers.hexlify(tos.code),
                    labels: tos.labels || [],
                    dao: tos.dao || ethers.ZeroAddress,
                    operators: tos.operator_ids || [], // Updated: now using operator_ids
                    status: Number(tos.status) === 0 ? 'waiting' : 'active' as TOSStatus,
                    restaked: 0,  // TODO: Calculate from operator staking data
                    stakers: 0,   // TODO: Calculate from operator staking data
                    likes: 0,     // TODO: Implement likes system
                    codeHash: ethers.keccak256(tos.code),
                }));

                // Fetch all registered operators
                const operatorCount = await vmContract.total_operators();
                console.log('Registered Operator Count:', operatorCount);

                if (operatorCount > 0) {
                    const operatorPromises = Array.from({ length: Number(operatorCount) }, (_, i) =>
                        vmContract.get_operator_by_index(i)
                    );

                    const operatorItems = await Promise.all(operatorPromises);
                    console.log('Fetched Operator items:', operatorItems);

                    // Convert contract Operator data to frontend format
                    const operatorData: Operator[] = operatorItems.map((op) => ({
                        id: op.id,
                        name: op.name,
                        logo: op.logo,
                        labels: op.operator_types,
                        owner: {
                            address: op.owner,
                            name: op.owner_name,
                            logo: op.owner_logo
                        },
                        location: op.location,
                        create_time: Number(op.create_time),
                        domain: op.domain,
                        port: Number(op.port),
                        staker_ids: op.staker_ids,
                        tos_ids: op.tos_ids,
                        vm_ids: [],
                        restaked: 0, // TODO: Calculate from staker data
                        numStakers: op.staker_ids.length,
                        numTosServing: op.tos_ids.length,
                        reputation: 0 // TODO: Implement reputation system
                    }));

                    setOperators(operatorData);
                }

                // Update TOS store
                setTOS(tosData);

            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Ensure store is set to empty array in case of total failure
                setTOS([]);
                setOperators([]);
            }
        };

        fetchData();
    }, [setTOS]);

    return {toss, operators, agents };
}

export { useVM, VM_CONTRACT_ADDRESS, VM_ABI };
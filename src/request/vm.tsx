import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { Operator, Agent, TOS, TOSStatus } from '../data/define';

const VM_CONTRACT_ADDRESS = import.meta.env.VITE_VM_CONTRACT_ADDRESS;

// VM合约ABI
/**
 * The ABI (Application Binary Interface) for the VM contract, defining
 * the available functions that can be called on the blockchain.
 * 
 * - TOS related functions:
 *   - `create_tos`: Creates a TOS (Terms of Service) with specified parameters.
 *   - `total_toss`: Returns the total number of TOS.
 *   - `get_tos_by_index`: Retrieves a TOS by its index in the registry.
 * 
 * - Operator related functions:
 *   - `total_operators`: Returns the total number of registered operators.
 *   - `get_operator_by_index`: Retrieves an operator by its index in the registry.
 *   - `register_operator_to_tos`: Registers an operator to a specific TOS.
 *   - `register_operator`: Registers a new operator with specified details.
 */
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
const DEFAULT_OPERATOR_LOGO = '/images/operator-logo-sm.png';
const DEFAULT_OPERATOR_OWNER_LOGO = '/images/operator-owner-logo-sm.png';

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
                        name: op.name || 'Unnamed Operator',
                        logo: op.logo || DEFAULT_OPERATOR_LOGO,
                        labels: op.operator_types || [],
                        owner: {
                            address: op.owner,
                            name: op.owner_name || 'Unknown',
                            logo: op.owner_logo || DEFAULT_OPERATOR_OWNER_LOGO
                        },
                        location: op.location || '',
                        create_time: Number(op.create_time),
                        domain: op.domain || '',
                        port: Number(op.port),
                        // Convert TOS IDs to string array
                        tos_ids: op.tos_ids?.map(id => id.toString()) || [],
                        staker_ids: op.staker_ids?.map(id => id.toString()) || [],
                        vm_ids: [],
                        restaked: 0,  // TODO: Calculate from staking data
                        numStakers: op.staker_ids?.length || 0,
                        numTosServing: op.tos_ids?.length || 0,
                        reputation: 0, // TODO: Implement reputation system
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

// Create contract instance
export async function createContractInstance() {
    if (!window.ethereum) {
        throw new Error('Please install and connect MetaMask');
    }

    // Request user to connect MetaMask
    const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
    });

    if (!accounts || accounts.length === 0) {
        throw new Error('Failed to get wallet account');
    }

    // Create provider and signer using ethers v6
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Verify contract address
    if (!VM_CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured');
    }

    // Create and return contract instance
    return new ethers.Contract(
        VM_CONTRACT_ADDRESS,
        VM_ABI,
        signer
    );
}

export { useVM };
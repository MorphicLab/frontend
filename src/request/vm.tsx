import { ethers } from 'ethers';

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
    "function create_tos(string memory name, string memory logo, string memory website, string memory description, string[] memory labels, string[] memory vtypes, uint8 operator_minimum, string memory creater_name, string memory creater_logo, uint16 vcpus, uint16 vmemory, uint64 disk, string memory version, bytes memory code, address dao) external returns(bytes16)",
    "function total_toss() public view returns (uint256)",
    "function get_tos_by_index(uint256 index) view returns (tuple(bytes16 id, string name, string logo, string website, string description, string[] labels, string[] vtypes, uint8 operator_minimum, address creater, string creater_name, string creater_logo, uint16 vcpus, uint16 vmemory, uint64 disk, string version, bytes code, bytes32 code_hash, address dao, uint8 status, uint256 restaked, string cert, address addr))",
    // Operator related functions
    "function total_operators() public view returns (uint256)",
    "function get_operator_by_index(uint256 index) view returns (tuple(address id, string name, string logo, string[] labels, string description, address owner, string owner_name, string owner_logo, string location, string domain, uint64 port))",
    "function register_vm_to_tos(bytes16 tos_id, tuple(bytes20 id, string vm_type, bytes16 tos_id, address operator_id, uint8 status, string code_hash) vm)",
    "function register_operator(string memory name, string memory logo, string[] memory labels, string memory description, address owner, string memory owner_name, string memory owner_logo, string memory location, string memory domain, uint64 port) external",
    // Vm related functions
    "function total_vms() public view returns (uint256)",
    "function get_vm_by_index(uint256 index) view returns (tuple(bytes20 id, string vm_type, bytes16 tos_id, address operator_id, uint8 status, string code_hash))"
];

const TIMEOUT = 500; // 1秒超时

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = TIMEOUT): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
    });
    return Promise.race([promise, timeout]);
}

// Create contract instance
export async function createContractInstance() {
    if (!window.ethereum) {
        throw new Error('Please install and connect MetaMask');
    }

    // Request user to connect MetaMask
    const accounts = await withTimeout(
        window.ethereum.request({ method: 'eth_requestAccounts' })
    );

    if (!accounts || accounts.length === 0) {
        throw new Error('Failed to get wallet account');
    }

    // Create provider and signer using ethers v6
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await withTimeout(provider.getSigner());

    // Verify contract address
    if (!VM_CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured');
    }

    // Create contract instance with timeout
    const contract = await withTimeout(Promise.resolve(new ethers.Contract(VM_CONTRACT_ADDRESS, VM_ABI, signer)));

    // Verify contract is accessible
    await withTimeout(contract.runner?.provider?.getCode(VM_CONTRACT_ADDRESS) || Promise.reject('No provider'));

    return contract;
}

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
    "function register_operator_to_tos(bytes16 tos_id, tuple(bytes20 id, address operator, tuple(string app_id, tuple(string rootfs_hash, string mrtd, string rtmr0, string rtmr1, string rtmr2, string rtmr3) tcb, bytes certificate) report, uint8 status) vm)",
    "function register_operator(string name, string logo, string[] operator_types, address owner, string owner_name, string owner_logo, string location, string domain, uint64 port) external",
    // Vm related functions
    "function total_vms() public view returns (uint256)",
    "function get_vm_by_index(uint256 index) public view returns (tuple(bytes20 id, address operator, tuple(string app_id, tuple(string rootfs_hash, string mrtd, string rtmr0, string rtmr1, string rtmr2, string rtmr3) tcb, bytes certificate) report, uint8 status))"
];


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

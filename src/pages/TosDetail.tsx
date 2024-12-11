import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink, Cpu, X, Shield, Copy, Check, HelpCircle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { MOCK_TOS, MOCK_OPERATORS, MOCK_MORPHIC_AI_VM, MOCK_VMs } from '../data/mockData';
import { ThinOperatorCard } from '../components/cards/ThinOperatorCard';
import { VerificationFlow } from '../components/verification/VerificationFlow';
import { useBlockchainStore } from '../components/store/chainStore';
import { hexlify } from 'ethers';
import { createContractInstance } from '../request/vm';
import { ThinVmCard } from '../components/cards/ThinVmCard';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// 图表配置
const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
            labels: {
                color: '#fff',
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
                color: '#fff',
            },
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
                color: '#fff',
            },
        },
    },
};

const TosDetail: React.FC = () => {
    const { id } = useParams();
    const [operatorSearch, setOperatorSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [vmCurrentPage, setVmCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const vmItemsPerPage = 5;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
    const [showVerification, setShowVerification] = useState(false);
    const [isCertCopied, setIsCertCopied] = useState(false);

    const allTOS = useBlockchainStore(state => state.toss);
    const allOperators = useBlockchainStore(state => state.operators);
    const allVms = useBlockchainStore(state => state.vms);
    const tosChartData = useBlockchainStore(state => state.tosChartData);
    const generateTosChartData = useBlockchainStore(state => state.generateTosChartData);

    // 从所有 TOS 中查找当前 TOS
    const tos = allTOS.find(t => t.id === id);

    // 获取我的运营商（使用 window.ethereum.selectedAddress）
    const myOperators = useMemo(() => {
        if (!window.ethereum?.selectedAddress) return [];
        return allOperators.filter(op => 
            op.owner.address.toLowerCase() === window.ethereum.selectedAddress.toLowerCase()
        );
    }, [allOperators]);

    // Generate chart data for this TOS if it doesn't exist
    useEffect(() => {
        if (id) {
            generateTosChartData(id);
        }
    }, [id, generateTosChartData]);

    const handleRegisterOperators = async () => {
        if (!tos || !selectedOperators.length) return;
        
        try {
            // Get contract instance
            const contract = await createContractInstance();

            // Register each selected operator to the TOS
            for (const operatorId of selectedOperators) {
                // Create a vm for this operator, using the MOCK_MORPHIC_AI_VM as a template
                
                // Generate a proper bytes20 ID using Web Crypto API
                const randomBytes = new Uint8Array(20);
                crypto.getRandomValues(randomBytes);

                const vm = { 
                    id: hexlify(randomBytes),
                    vm_type: MOCK_MORPHIC_AI_VM.type,
                    tos_id: tos.id,
                    operator_id: operatorId,
                    report: {
                        tos_info: {
                            code_hash: tos.code_hash,
                            ca_cert_hash: MOCK_MORPHIC_AI_VM.report.tos_info?.ca_cert_hash
                        },
                        tcb_info: MOCK_MORPHIC_AI_VM.report.tcb_info,
                        quote: MOCK_MORPHIC_AI_VM.report.quote
                    },
                    status: MOCK_MORPHIC_AI_VM.status,
                    code_hash: tos.code_hash   // should be obtained from report
                    // TODO: add cert here
                };

                try {
                    await contract.register_vm_to_tos(tos.id, vm, {gasLimit: 3000000});
                    console.log(`Registered vm ${vm.id} with operator ${operatorId} to TOS ${tos.id}`);
                    alert('Operator with a new CVM registered successfully');
                } catch (error) {
                    console.error(`Failed to register operator ${operatorId}:`, error);
                    // Optionally, you might want to break the loop or handle the error differently
                }
            }

            
            setIsModalOpen(false);
            setSelectedOperators([]);
        } catch (error) {
            console.error('Error registering operators:', error);
        }
    };

    const toggleOperator = (operatorId: string) => {
        setSelectedOperators(prev =>
            prev.includes(operatorId)
                ? prev.filter(id => id !== operatorId)
                : [...prev, operatorId]
        );
    };

    const tosOperators = tos?.id 
        ? allOperators.filter(op => op.vm_ids?.hasOwnProperty(tos.id))
        : [];

    const tosVms = tos?.id 
        ? allVms.filter(vm => vm.tos_id === tos.id)
        : [];

    const operatorsPerPage = 5;

    // Calculate pagination
    const indexOfLastOperator = currentPage * operatorsPerPage;
    const indexOfFirstOperator = indexOfLastOperator - operatorsPerPage;
    const currentPageOperators = tosOperators.slice(indexOfFirstOperator, indexOfLastOperator);
    const totalPages = Math.ceil(tosOperators.length / operatorsPerPage);

    // Calculate pagination for VMs
    const indexOfLastVm = vmCurrentPage * vmItemsPerPage;
    const indexOfFirstVm = indexOfLastVm - vmItemsPerPage;
    const currentVms = tosVms.slice(indexOfFirstVm, indexOfLastVm);
    const vmTotalPages = Math.ceil(tosVms.length / vmItemsPerPage);

    // Handle page changes
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleVmPageChange = (pageNumber: number) => {
        setVmCurrentPage(pageNumber);
    };

    const copyToClipboard = async () => {
        if (tos?.cert) {
            await navigator.clipboard.writeText(tos.cert);
            setIsCertCopied(true);
            setTimeout(() => setIsCertCopied(false), 2000);
        }
    };

    if (!tos) return <div>TOS not found</div>;

    return (
        <div className="pt-20 min-h-screen bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-400 mb-8">
                    <Link to="/tos-services" className="hover:text-white transition-colors">
                        TOS Services
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-white">{tos.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={tos.logo}
                                        alt={tos.name}
                                        className="w-16 h-16 rounded-lg"
                                    />
                                    <div>
                                        <div className="flex items-center space-x-4">
                                            <h1 className="text-3xl font-bold text-white">
                                                {tos.name}
                                            </h1>
                                            <button
                                                onClick={() => setShowVerification(true)}
                                                className="flex items-center space-x-1 px-3 py-1 bg-morphic-primary/10 
                                                text-morphic-primary rounded-full text-sm hover:bg-morphic-primary/20 transition-colors"
                                            >
                                                <Shield className="h-4 w-4" />
                                                <span>Verify</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center text-gray-400 mt-2">
                                            <span className="font-mono">{tos.id.slice(0, 6)}...{tos.id.slice(-4)}</span>
                                            <ExternalLink className="h-4 w-4 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Blockchain</div>
                                    <div className="text-white font-semibold mt-1">
                                        Ethereum
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Required operators</div>
                                    <div className="text-white font-semibold mt-1">
                                    ≥{tos.operator_minimum} 
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Required instances</div>
                                    <div className="text-white font-semibold mt-1">
                                        ≥{tos.operator_minimum}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Total Restaked</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tos.restaked}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Trustlessness Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-800 rounded-xl border border-morphic-primary/20 p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4">Trustlessness</h2>
                            <div className="space-y-4">
                                {/* Decentralization */}
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm flex items-center">
                                        Decentralization
                                        <div className="group relative ml-1">
                                            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                                            <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-sm bg-gray-800 rounded-lg shadow-lg">
                                                Number of operators currently running this TOS, ensuring decentralized operation and fault tolerance.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-white font-mono text-sm mt-1">
                                        {Math.min(tosOperators.length, tosVms.length)} <span className="text-gray-400 text-sm ml-1"> ({tosOperators.length} active operators, {tosVms.length} active instances)</span>
                                    </div>
                                </div>

                                {/* Verifiability */}
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm flex items-center">
                                        Verifiability
                                        <div className="group relative ml-1">
                                            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                                            <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-sm bg-gray-800 rounded-lg shadow-lg">
                                                The address of this TOS, ensuring integrity and correctness of the service.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-white font-mono text-sm mt-1">
                                        {tos.address || 'Address not available'} <span className="text-gray-400 text-sm ml-1"> (The TOS account shared by shards) </span>
                                    </div>
                                    
                                </div>

                                {/* Finality */}
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm flex items-center">
                                        Finality
                                        <div className="group relative ml-1">
                                            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                                            <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-sm bg-gray-800 rounded-lg shadow-lg">
                                                Types of mechanisms used to ensure finality of the output.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-white font-mono text-sm mt-1 flex items-center">
                                        <span className="mr-2">TEE</span>
                                        <span className="flex items-center space-x-2">
                                            {Array.from(new Set(tosVms.map(vm => vm.type))).map(label => (
                                                <span
                                                    key={label}
                                                    className="px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center"
                                                >
                                                    <Cpu className="h-3 w-3 mr-1" />
                                                    {label}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>

                                {/* Confidentiality */}
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm flex items-center">
                                        Confidentiality
                                        <div className="group relative ml-1">
                                            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                                            <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-sm bg-gray-800 rounded-lg shadow-lg">
                                                Types of mechanisms to ensure confidentiality.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-white font-mono text-sm mt-1 flex items-center">
                                        <span className="mr-2">TEE</span>
                                        <span className="flex items-center space-x-2">
                                            {Array.from(new Set(tosVms.map(vm => vm.type))).map(label => (
                                                <span
                                                    key={label}
                                                    className="px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center"
                                                >
                                                    <Cpu className="h-3 w-3 mr-1" />
                                                    {label}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stake Area */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Stake</h2>
                            <div className="space-y-3">
                                {/* ETH */}
                                <div className="bg-gray-700/50 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors">
                                    <div className="flex items-center">
                                        <span className="text-gray-400 text-sm w-16">ETH</span>
                                        <div className="flex-1 flex justify-end items-center space-x-8">
                                            <span className="text-white text-sm">15.5 ETH</span>
                                            <span className="text-gray-400 text-sm">$23,250</span>
                                        </div>
                                    </div>
                                </div>

                                {/* USDT */}
                                <div className="bg-gray-700/50 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors">
                                    <div className="flex items-center">
                                        <span className="text-gray-400 text-sm w-16">USDT</span>
                                        <div className="flex-1 flex justify-end items-center space-x-8">
                                            <span className="text-white text-sm">2,170 USDT</span>
                                            <span className="text-gray-400 text-sm">$2,170</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Virtual Machines */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <span>Instances</span>
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {tosVms.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        No instances registered yet
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                                        {currentVms.map(vm => (
                                            <ThinVmCard key={vm.id} vm={vm} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {vmTotalPages > 1 && (
                                <div className="flex justify-center space-x-2 mt-6">
                                    {Array.from({ length: vmTotalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handleVmPageChange(page)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                vmCurrentPage === page
                                                    ? 'bg-morphic-primary text-white'
                                                    : 'bg-gray-800 text-gray-300 hover:bg-morphic-primary/20'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Showing entries info */}
                            <div className="text-gray-400 text-sm text-center mt-4">
                                Showing {indexOfFirstVm + 1} to {Math.min(indexOfLastVm, tosVms.length)} of {tosVms.length} virtual machines
                            </div>
                        </motion.div>

                        {/* Operators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4">Operators</h2>
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                                    {currentPageOperators.map(operator => (
                                        <ThinOperatorCard key={operator.id} operator={operator} />
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-morphic-primary text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-morphic-primary/20'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Showing entries info */}
                                <div className="text-gray-400 text-sm text-center mt-4">
                                    Showing {indexOfFirstOperator + 1} to {Math.min(indexOfLastOperator, tosOperators.length)} of {tosOperators.length} operators
                                </div>
                            </div>
                        </motion.div>

                        {/* Serve Button at the bottom left */}
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-3 bg-morphic-primary text-white rounded-lg hover:bg-morphic-accent transition-colors"
                            >
                                Serve this TOS
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Charts */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Restaking & Rewards
                            </h3>
                            {id && tosChartData[id] && <Line options={chartOptions} data={tosChartData[id]} />}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Token Distribution
                            </h3>
                            <Line
                                options={chartOptions}
                                data={tosChartData[id] ? tosChartData[id] : { labels: [], datasets: [] }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Operator Growth
                            </h3>
                            <Line options={chartOptions} data={tosChartData[id] ? tosChartData[id] : { labels: [], datasets: [] }} />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Select Operators Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Select Operators</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                {myOperators.map(operator => (
                                    <div
                                        key={operator.id}
                                        onClick={() => toggleOperator(operator.id)}
                                        className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedOperators.includes(operator.id)
                                            ? 'bg-morphic-primary/20 border-2 border-morphic-primary'
                                            : 'bg-gray-700/50 hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={operator.logo}
                                                    alt={operator.name}
                                                    className="w-10 h-10 rounded-lg"
                                                />
                                                <h3 className="text-white font-medium">{operator.name}</h3>
                                            </div>
                                            <div className="flex space-x-2 mt-1">
                                                {operator.labels.map(label => (
                                                    <span
                                                        key={label}
                                                        className="px-2 py-1 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center"
                                                    >
                                                        <Cpu className="h-3 w-3 mr-1" />
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                {operator.restaked} ETH staked
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRegisterOperators}
                                    disabled={selectedOperators.length === 0}
                                    className="px-6 py-2 bg-morphic-primary text-white rounded-lg hover:bg-morphic-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Register ({selectedOperators.length} selected)
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 验证画布 */}
            {showVerification && tos && (
                <VerificationFlow
                    tos={tos}
                    operators={tosOperators}
                    vms={allVms}
                    onClose={() => setShowVerification(false)}
                />
            )}
        </div>
    );
};

export default TosDetail;
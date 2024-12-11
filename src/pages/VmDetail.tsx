import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, ChevronRight, Shield, ExternalLink, Code, Terminal } from 'lucide-react';
import { useBlockchainStore } from '../components/store/chainStore';
import { VmStatus } from '../data/define';
import PageBackground from '../components/PageBackground';

const statusColors = {
    [VmStatus.Waiting]: 'bg-yellow-100 text-yellow-800',
    [VmStatus.Active]: 'bg-green-100 text-green-800',
};

const statusText = {
    [VmStatus.Waiting]: 'Waiting',
    [VmStatus.Active]: 'Active',
};

const VmDetail: React.FC = () => {
    const { id } = useParams();
    const vms = useBlockchainStore(state => state.vms);
    const operators = useBlockchainStore(state => state.operators);
    const vm = vms.find(v => v.id === id);
    const operator = vm ? operators.find(op => op.id === vm.operator_id) : null;

    if (!vm) {
        return (
            <div className="pt-20 min-h-screen bg-gray-900">
                <PageBackground />
                <div className="container mx-auto px-4">
                    <div className="text-center text-gray-400">
                        VM not found
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-900">
            <PageBackground />
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
                    <Link to="/" className="hover:text-morphic-primary">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link to={`/operator/${operator?.id}`} className="hover:text-morphic-primary">
                        {operator?.name || 'Operator'}
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white">VM Details</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <Cpu className="h-8 w-8 mr-3 text-morphic-primary" />
                        Virtual Machine Details
                    </h1>
                    <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[vm.status]}`}>
                            {statusText[vm.status]}
                        </span>
                        <span className="text-gray-400">ID: {vm.id}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Basic Info Card */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-morphic-primary/20">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <Terminal className="h-5 w-5 mr-2 text-morphic-primary" />
                                Basic Information
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                    <span className="text-gray-400">Type</span>
                                    <span className="text-white font-medium">{vm.type}</span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                    <span className="text-gray-400">Operator</span>
                                    <Link
                                        to={`/operator/${operator?.id}`}
                                        className="text-morphic-primary hover:text-morphic-accent flex items-center"
                                    >
                                        {operator?.name}
                                        <ExternalLink className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                    <span className="text-gray-400">Code Hash</span>
                                    <span className="text-white font-mono text-sm">{vm.code_hash}</span>
                                </div>
                            </div>
                        </div>

                        {/* Attestation Report */}
                        {vm.report && (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-morphic-primary/20">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                    <Shield className="h-5 w-5 mr-2 text-morphic-primary" />
                                    Attestation Report
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">TCB Hash</span>
                                        <span className="text-white font-mono text-sm">{vm.report.quote.tcb_hash}</span>
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">User Data</span>
                                        <span className="text-white font-mono text-sm">{vm.report.quote.user_data}</span>
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Nonce</span>
                                        <span className="text-white font-mono text-sm">{vm.report.quote.nonce}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column - Certificate */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-morphic-primary/20">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <Code className="h-5 w-5 mr-2 text-morphic-primary" />
                                Certificate
                            </h2>
                            <div className="bg-gray-900/50 rounded-lg p-4">
                                <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                                    {vm.cert || 'No certificate available'}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VmDetail;

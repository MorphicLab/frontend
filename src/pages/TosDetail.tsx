import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, ExternalLink, Cpu, Star, Users, Coins, X, Shield } from 'lucide-react';
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
import { MOCK_TOS, MOCK_OPERATORS, TOS } from '../data/mockData';
import { ThinOperatorCard } from '../components/cards/ThinOperatorCard';
import { VerificationFlow } from '../components/verification/VerificationFlow';

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

// 生成图表数据
const generateChartData = (label: string) => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label,
            data: Array.from({ length: 6 }, () => Math.random() * 100),
            borderColor: 'rgb(70, 220, 225)',
            backgroundColor: 'rgba(70, 220, 225, 0.1)',
            fill: true,
            tension: 0.4,
        },
    ],
});

// 更新 TOS 接口
interface ExtendedTOS extends TOS {
    blockchain?: string;
    blockHeight?: string;
}

// 添加常量定义
const ETHERSCAN_BASE_URL = 'https://etherscan.io/tx/';  // use Ethereaum mainnet for now

const TosDetail = () => {
    const { id } = useParams();
    const [operatorSearch, setOperatorSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOperators, setSelectedOperators] = useState<number[]>([]);
    const [showVerification, setShowVerification] = useState(false);

    // 获取 TOS 数据并添加额外字段
    const tos = MOCK_TOS.find(t => t.id === Number(id)) as ExtendedTOS;
    if (tos) {
        tos.blockchain = 'Ethereum';
        tos.blockHeight = '18,245,123';
    }

    // 获取用户的 operators
    const myOperators = MOCK_OPERATORS.slice(0, 3);

    const filteredOperators = MOCK_OPERATORS.filter(op =>
        op.name.toLowerCase().includes(operatorSearch.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);
    const currentOperators = filteredOperators.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleOperator = (operatorId: number) => {
        setSelectedOperators(prev =>
            prev.includes(operatorId)
                ? prev.filter(id => id !== operatorId)
                : [...prev, operatorId]
        );
    };

    const handleRegister = () => {
        console.log('Registering with operators:', selectedOperators);
        setIsModalOpen(false);
        // TODO: 处理注册逻辑
    };

    // 添加处理函数
    const handleVerify = () => {
        if (tos?.txHash) {
            window.open(`${ETHERSCAN_BASE_URL}${tos.txHash}`, '_blank');
        }
    };

    // TODO: Obtain the operators of this TOS
    const tosOperators = MOCK_OPERATORS

    // 获取相关的 operators
    const relatedOperators = MOCK_OPERATORS.filter(op => 
        op.numTosServing.toString() === tos?.operators.toString()
    );

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
                                            <span className="font-mono">{tos.address.slice(0, 6)}...{tos.address.slice(-4)}</span>
                                            <ExternalLink className="h-4 w-4 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Blockchain</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tos.blockchain}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Block Height</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tos.blockHeight}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Total Restaked</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tos.restaked}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Total Stakes</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tos.stakers}
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
                                    {tosOperators.map(operator => (
                                        <ThinOperatorCard key={operator.id} operator={operator} />
                                    ))}
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
                            <Line options={chartOptions} data={generateChartData('Value')} />
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
                                data={generateChartData('Distribution')}
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
                            <Line options={chartOptions} data={generateChartData('Operators')} />
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
                                    onClick={handleRegister}
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
                    onClose={() => setShowVerification(false)}
                />
            )}
        </div>
    );
};

export default TosDetail;
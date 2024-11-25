import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Search, ExternalLink, Cpu } from 'lucide-react';
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

// Mock data
const tosData = {
    name: 'Morphic AI',
    logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop',
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    website: '/morphic-ai',
    blockchain: 'Ethereum',
    blockHeight: 21252158,
    restaked: '$20M',
    operators: 15,
    stakes: '1.2k',
    likes: 142,
};

const stakingTokens = [
    { symbol: 'ETH', amount: '962', value: '$2.1M' },
    { symbol: 'Morphic', amount: '50,000', value: '$750K' },
    { symbol: 'BTC', amount: '12', value: '$720K' },
    { symbol: 'BNB', amount: '2,500', value: '$680K' },
];

const operators = [
    {
        name: 'Alpha Node',
        type: 'TEE',
        restaked: '$20M',
        stakers: 100,
        tosServing: 1,
    },
    // Add more operators...
];

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

const TosDetail = () => {
    const [operatorSearch, setOperatorSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredOperators = operators.filter(op =>
        op.name.toLowerCase().includes(operatorSearch.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);
    const currentOperators = filteredOperators.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="pt-20 min-h-screen bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-400 mb-8">
                    <Link to="/tos-services" className="hover:text-white transition-colors">
                        TOS Services
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-white">{tosData.name}</span>
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
                            <div className="flex items-center mb-6">
                                <img
                                    src={tosData.logo}
                                    alt={tosData.name}
                                    className="w-16 h-16 rounded-xl mr-4"
                                />
                                <div>
                                    <Link to={tosData.website} className="text-3xl font-bold text-white">
                                        <h1 className="text-3xl font-bold text-white">{tosData.name}</h1>
                                    </Link>
                                    <div className="flex items-center text-gray-400 mt-2">
                                        <span className="text-sm">
                                            {tosData.address.slice(0, 6)}...{tosData.address.slice(-4)}
                                        </span>
                                        <ExternalLink className="h-4 w-4 ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Blockchain</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tosData.blockchain}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Block Height</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tosData.blockHeight}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Total Restaked</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tosData.restaked}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm">Total Stakes</div>
                                    <div className="text-white font-semibold mt-1">
                                        {tosData.stakes}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Staking Tokens */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4">Stake</h2>
                            <div className="space-y-4">
                                {stakingTokens.map((token) => (
                                    <div
                                        key={token.symbol}
                                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <div className="text-white font-medium">{token.symbol}</div>
                                                <div className="text-gray-400 text-sm">{token.amount}</div>
                                            </div>
                                        </div>
                                        <div className="text-white font-medium">{token.value}</div>
                                    </div>
                                ))}
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

                            {/* Search */}
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search operators..."
                                    value={operatorSearch}
                                    onChange={(e) => setOperatorSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Operators List */}
                            <div className="space-y-4">
                                {currentOperators.map((operator, index) => (
                                    <motion.div
                                        key={operator.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="text-white font-medium">
                                                        {operator.name}
                                                    </span>
                                                    {operator.type === 'TEE' && (
                                                        <span className="ml-2 px-2 py-1 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center">
                                                            <Cpu className="h-3 w-3 mr-1" />
                                                            TEE
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 text-sm">
                                            <div className="text-gray-400">
                                                <span className="text-white font-medium">
                                                    {operator.restaked}
                                                </span>{' '}
                                                restaked
                                            </div>
                                            <div className="text-gray-400">
                                                <span className="text-white font-medium">
                                                    {operator.stakers}
                                                </span>{' '}
                                                stakers
                                            </div>
                                            <div className="text-gray-400">
                                                <span className="text-white font-medium">
                                                    {operator.tosServing}
                                                </span>{' '}
                                                TOS
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </motion.div>
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
        </div>
    );
};

export default TosDetail;
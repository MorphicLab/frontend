import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Cpu, 
    MapPin, 
    Coins, 
    Users, 
    Star, 
    Shield,
    ExternalLink 
} from 'lucide-react';
import { MOCK_OPERATORS } from '../data/mockData';
import PageBackground from '../components/PageBackground';

const OperatorDetail: React.FC = () => {
    const { id } = useParams();
    const operator = MOCK_OPERATORS.find(op => op.id === Number(id));

    if (!operator) return <div>Operator not found</div>;

    return (
        <div className="pt-20 min-h-screen bg-gray-900">
            <PageBackground />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 左侧内容区域 */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 基本信息 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={operator.logo}
                                    alt={operator.name}
                                    className="w-16 h-16 rounded-lg"
                                />
                                <div>
                                    <div className="flex items-center space-x-4">
                                        <h1 className="text-3xl font-bold text-white">
                                            {operator.name}
                                        </h1>
                                        <button 
                                            className="flex items-center space-x-1 px-3 py-1 bg-morphic-primary/10 
                                            text-morphic-primary rounded-full text-sm hover:bg-morphic-primary/20 transition-colors"
                                        >
                                            <Shield className="h-4 w-4" />
                                            <span>Verify</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center text-gray-400 mt-2">
                                        <span className="font-mono">{operator.address.slice(0, 6)}...{operator.address.slice(-4)}</span>
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 标签和介绍 */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {operator.labels.map(label => (
                                    <span
                                        key={label}
                                        className="px-3 py-1 bg-morphic-primary/20 text-morphic-primary text-sm rounded-full flex items-center"
                                    >
                                        <Cpu className="h-4 w-4 mr-2" />
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-300">
                                {operator.introduction}
                            </p>
                        </div>

                        {/* 详细信息 */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-800 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
                                <div className="flex items-center text-gray-300">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    {operator.location}
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Reputation</h2>
                                <div className="flex items-center text-gray-300">
                                    <Star className="h-5 w-5 mr-2" />
                                    {operator.reputation}
                                </div>
                            </div>
                        </div>

                        {/* 性能指标 */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-gray-400 mb-2">Uptime</div>
                                    <div className="text-2xl font-bold text-white">99.9%</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-2">Response Time</div>
                                    <div className="text-2xl font-bold text-white">45ms</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-2">Success Rate</div>
                                    <div className="text-2xl font-bold text-white">99.8%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧内容区域 */}
                    <div className="space-y-8">
                        {/* Stake 信息 */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Stake</h2>
                            <div className="flex justify-between items-center text-gray-300 mb-4">
                                <span>Total Staked</span>
                                <span className="text-xl font-bold text-white">{operator.restaked} ETH</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300 mb-4">
                                <span>Stakers</span>
                                <span className="text-xl font-bold text-white">{operator.numStakers}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>TOS Serving</span>
                                <span className="text-xl font-bold text-white">{operator.numTosServing}</span>
                            </div>
                        </div>

                        {/* Owner 信息 */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Owner</h2>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={operator.owner.logo}
                                    alt={operator.owner.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <div className="text-white font-medium">{operator.owner.name}</div>
                                    <div className="text-gray-400 text-sm">Verified Owner</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorDetail; 
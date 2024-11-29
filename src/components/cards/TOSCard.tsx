import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Coins, Users, Star, ThumbsUp } from 'lucide-react';
import { TOS, TOSStatus, MOCK_TOS } from '../../data/mockData';
import { useVM } from '../../request/vm';

// 状态样式映射
const statusStyles: Record<TOSStatus, { color: string; bgColor: string }> = {
    active: { color: 'text-green-400', bgColor: 'bg-green-400/10' },
    waiting: { color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
    stopped: { color: 'text-gray-400', bgColor: 'bg-gray-400/10' },
    failed: { color: 'text-red-400', bgColor: 'bg-red-400/10' }
};

interface TOSCardProps {
    tos: TOS;
    index?: number;
}

export const TOSCard: React.FC<TOSCardProps> = ({ tos: propTos, index = 0 }) => {
    const vm = useVM();
    
    // 根据环境获取TOS数据
    const tos = import.meta.env.VITE_API_MOCK === 'true' ? 
        MOCK_TOS.find(t => t.id === propTos.id) || propTos :
        vm.tos.find(t => t.id === propTos.id) || propTos;
        
    const statusStyle = statusStyles[tos.status];

    return (
        <Link to={`/tos-services/${tos.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl border border-morphic-primary/20 overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                        <img
                            src={tos.logo}
                            alt={tos.name}
                            className="w-12 h-12 rounded-lg"
                        />
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusStyle.bgColor} ${statusStyle.color}`}>
                                {tos.status}
                            </span>
                            <span className="text-gray-400 text-sm">
                                {tos.dao.slice(0, 6)}...{tos.dao.slice(-4)}
                            </span>
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{tos.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{tos.description}</p>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <img
                            src={tos.creator.logo}
                            alt={tos.creator.name}
                            className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-gray-300 text-sm">{tos.creator.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-400">
                            <Coins className="h-4 w-4 mr-2" />
                            <span className="text-sm">{tos.restaked} ETH</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="text-sm">{tos.operators} Operators</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Star className="h-4 w-4 mr-2" />
                            <span className="text-sm">{tos.stakers} Stakers</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            <span className="text-sm">{tos.likes} Likes</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}; 
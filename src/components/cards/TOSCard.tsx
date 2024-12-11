import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Coins, Users, Star, ThumbsUp } from 'lucide-react';
import { TOS, TosStatus } from '../../data/define';

interface TOSCardProps {
    tos: TOS;
    index?: number;
}

export const TOSCard: React.FC<TOSCardProps> = ({ tos, index = 0 }) => (
    <Link to={`/tos-services/${tos.id}`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            // transition={{ delay: index * 0.1 }}
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
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            tos.status === TosStatus.Active 
                                ? 'bg-green-500/20 text-green-500'
                                : tos.status === TosStatus.Waiting
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : 'bg-gray-500/20 text-gray-500'
                        }`}>
                            {TosStatus[tos.status].toLowerCase()}
                        </span>
                        {tos.id && (  // 添加条件检查
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400 text-sm">
                                    {tos.id.slice(0, 6)}...{tos.id.slice(-4)}
                                </span>
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                        )}
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
                        <span className="text-sm">{tos.restaked || 0} ETH</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{Object.keys(tos.vm_ids || {}).length} Operators</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                        <Star className="h-4 w-4 mr-2" />
                        <span className="text-sm">{tos.num_stakers || 0} Stakers</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        <span className="text-sm">{tos.likes || 0} Likes</span>
                    </div>
                </div>
            </div>
        </motion.div>
    </Link>
); 
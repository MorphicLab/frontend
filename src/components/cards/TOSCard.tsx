import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Coins, Users, Star, ThumbsUp } from 'lucide-react';

interface TOSCardProps {
    tos: {
        id: number;
        name: string;
        logo: string;
        address: string;
        introduction: string;
        labels: string[];
        publisher: {
            name: string;
            logo: string;
        };
        restaked: number;
        operators: number;
        stakes: number;
        likes: number;
    };
    index?: number;
}

export const TOSCard: React.FC<TOSCardProps> = ({ tos, index = 0 }) => (
    <Link to={`/tos-services/${tos.id}`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    <img
                        src={tos.logo}
                        alt={tos.name}
                        className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex items-center text-gray-400 text-sm">
                        {tos.address.slice(0, 6)}...{tos.address.slice(-4)}
                        <ExternalLink className="h-4 w-4 ml-1" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{tos.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{tos.introduction}</p>
            </div>

            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img
                        src={tos.publisher.logo}
                        alt={tos.publisher.name}
                        className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-gray-300 text-sm">{tos.publisher.name}</span>
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
                        <span className="text-sm">{tos.stakes}k Stakes</span>
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
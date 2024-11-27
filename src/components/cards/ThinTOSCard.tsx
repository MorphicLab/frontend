import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Coins, Users } from 'lucide-react';
import { TOS } from '../../data/mockData';

interface ThinTOSCardProps {
    tos: TOS;
}

export const ThinTOSCard: React.FC<ThinTOSCardProps> = ({ tos }) => (
    <Link to={`/tos-services/${tos.id}`}>
        <motion.div
            className="bg-gray-800/50 rounded-lg px-4 py-3 hover:bg-gray-700/50 transition-colors border border-morphic-primary/20"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src={tos.logo}
                        alt={tos.name}
                        className="w-8 h-8 rounded-lg"
                    />
                    <span className="text-white font-medium">{tos.name}</span>
                    <div className="flex items-center space-x-2">
                        {tos.labels.map(label => (
                            <span
                                key={label}
                                className="px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center space-x-6 text-gray-400 text-sm">
                    <div className="flex items-center">
                        <Coins className="h-4 w-4 mr-2" />
                        <span>{tos.restaked} ETH</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{tos.operators} Operators</span>
                    </div>
                </div>
            </div>
        </motion.div>
    </Link>
); 
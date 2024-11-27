import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { Operator } from '../../data/mockData';

interface ThinOperatorCardProps {
    operator: Operator;
}

export const ThinOperatorCard: React.FC<ThinOperatorCardProps> = ({ operator }) => (
    <Link to={`/operator/${operator.id}`}>
        <motion.div
            className="bg-gray-800/50 rounded-lg px-4 py-3 hover:bg-gray-700/50 transition-colors border border-morphic-primary/20"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src={operator.logo}
                        alt={operator.name}
                        className="w-8 h-8 rounded-lg"
                    />
                    <span className="text-white font-medium">{operator.name}</span>
                    <div className="flex items-center space-x-2">
                        {operator.labels.map(label => (
                            <span
                                key={label}
                                className="px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center"
                            >
                                <Cpu className="h-3 w-3 mr-1" />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="text-gray-400 text-sm">
                    {operator.restaked} ETH staked
                </div>
            </div>
        </motion.div>
    </Link>
); 
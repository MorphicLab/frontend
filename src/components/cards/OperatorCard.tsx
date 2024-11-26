import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, MapPin, Coins, Users, Star } from 'lucide-react';
import { Operator } from '../../data/mockData';

interface OperatorCardProps {
    operator: Operator;
}

export const OperatorCard: React.FC<OperatorCardProps> = ({ operator }) => (
    <motion.div
        className="bg-gray-800/50 rounded-xl border border-morphic-primary/20 overflow-hidden hover:border-morphic-primary/40 transition-all duration-300"
    >
        <div className="p-5 border-b border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src={operator.logo}
                        alt={operator.name}
                        className="w-12 h-12 rounded-lg"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {operator.name}
                        </h3>
                        <div className="flex items-center mt-2 space-x-2">
                            {operator.labels.map(label => (
                                <span key={label} className="px-2 py-1 bg-morphic-primary/20 text-morphic-light text-xs rounded-full flex items-center">
                                    <Cpu className="h-3 w-3 mr-1" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm font-mono">
                        {operator.address.slice(0, 6)}...{operator.address.slice(-4)}
                    </span>
                    <button className="px-4 py-2 bg-morphic-primary hover:bg-morphic-accent text-white text-sm rounded-lg transition-colors">
                        Stake
                    </button>
                </div>
            </div>
        </div>

        <div className="p-5">
            <div className="grid grid-cols-6 gap-6">
                <div className="flex items-center text-gray-400">
                    <img
                        src={operator.owner.logo}
                        alt={operator.owner.name}
                        className="w-6 h-6 rounded-full mr-2"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Owner</span>
                        <span className="text-sm">{operator.owner.name}</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Location</span>
                        <span className="text-sm">{operator.location}</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-400">
                    <Coins className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Restaked</span>
                        <span className="text-sm">{operator.restaked} ETH</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Stakers</span>
                        <span className="text-sm">{operator.numStakers}</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-400">
                    <Star className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">TOS Serving</span>
                        <span className="text-sm">{operator.numTosServing}</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-400">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Reputation</span>
                        <span className="text-sm">{operator.reputation}</span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
); 
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Users, Star } from 'lucide-react';
import { Agent } from '../../data/mockData';

interface AgentCardProps {
    agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => (
    <motion.div
        className="bg-gray-800/50 rounded-xl border border-morphic-primary/20 overflow-hidden hover:border-morphic-primary/40 transition-all duration-300 cursor-pointer"
    >
        <div className="p-6 text-center border-b border-gray-700">
            <img
                src={agent.logo}
                alt={agent.name}
                className="w-20 h-20 mx-auto mb-4 rounded-xl"
            />
            <h3 className="text-lg font-semibold text-white mb-2">
                {agent.name}
            </h3>
            <div className="flex justify-center gap-2 mb-3">
                {agent.labels.map(label => (
                    <span key={label} className="px-2 py-1 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center">
                        <Cpu className="h-3 w-3 mr-1" />
                        {label}
                    </span>
                ))}
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">
                {agent.introduction}
            </p>
        </div>

        <div className="p-4 flex justify-between items-center">
            <div className="flex items-center text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">{agent.users}</span>
            </div>
            <div className="flex items-center text-gray-400">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-sm">{agent.rating}</span>
            </div>
        </div>
    </motion.div>
); 
import { motion, AnimatePresence } from 'framer-motion';
import {
    CircuitBoard,
    Network,
    Lock
} from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { useNavigate } from 'react-router-dom';
import { MOCK_AGENTS, agentLabels } from '../data/mockData';
import { SearchAndFilter, useSearchAndFilter } from '../components/common/SearchAndFilter';
import { AgentCard } from '../components/cards/AgentCard';

const Product = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Advanced AI Processing',
            description: 'State-of-the-art machine learning algorithms for intelligent data processing',
            icon: CircuitBoard
        },
        {
            title: 'Real-time Analysis',
            description: 'Lightning-fast processing with immediate insights',
            icon: Network
        },
        {
            title: 'Enterprise Security',
            description: 'Military-grade encryption and secure computing environment',
            icon: Lock
        }
    ];

    const {
        search,
        setSearch,
        selectedLabels,
        toggleLabel,
        filteredItems: filteredAgents
    } = useSearchAndFilter(MOCK_AGENTS);

    return (
        <div className="pt-20 min-h-screen bg-gray-900">
            <PageBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-morphic-primary via-morphic-accent to-morphic-light bg-clip-text text-transparent mb-6">
                        Morphic AI
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Next-generation artificial intelligence platform for enterprise solutions
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gray-800 rounded-lg p-8 hover:bg-gray-750 transition-colors text-center"
                            >
                                <feature.icon className="h-12 w-12 text-cyan-300 mx-auto mb-6" />
                                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Basic Stats */}
                    <div className="grid grid-cols-3 gap-6 my-16">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="text-3xl font-bold text-morphic-primary mb-2">
                                {filteredAgents.length}
                            </div>
                            <div className="text-gray-400">Total Agents</div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="text-3xl font-bold text-morphic-primary mb-2">
                                25.6k
                            </div>
                            <div className="text-gray-400">Active Users</div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="text-3xl font-bold text-morphic-primary mb-2">
                                4.7
                            </div>
                            <div className="text-gray-400">Average Rating</div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <SearchAndFilter
                        search={search}
                        onSearchChange={setSearch}
                        labels={agentLabels}
                        selectedLabels={selectedLabels}
                        onLabelToggle={toggleLabel}
                        searchPlaceholder="Search agents"
                    />

                    {/* Agents Grid */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        <AnimatePresence mode="wait">
                            {filteredAgents.map(agent => (
                                <AgentCard 
                                    key={agent.id} 
                                    agent={agent} 
                                    onClick={() => navigate(`/agent-chat/${agent.id}`, { state: { agent } })}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <button
                        onClick={() => navigate('/developer', { state: { activeTab: 'agent' } })}
                        className="px-8 py-3 rounded-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold transition-colors"
                    >
                        Deliver Your Trustless Agent with Morphic-AI
                    </button>
                </motion.div>

            </div>

        </div>
    );
};

export default Product;
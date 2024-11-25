import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Users,
    Star,
    Cpu,
    CircuitBoard,
    Network,
    Lock
} from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { useNavigate } from 'react-router-dom';

// 扩展 MOCK_AGENTS 的类型定义
interface Agent {
  id: number;
  name: string;
  logo: string;
  type: string[];
  introduction: string;
  users: string;
  rating: number;
  status?: 'online' | 'offline';
  capabilities?: string[];
  modelType?: string;
}

const MOCK_AGENTS: Agent[] = [
  {
    id: 1,
    name: "ChatBot Agent",
    logo: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop",
    type: ["Chat"],
    introduction: "An intelligent chatbot powered by advanced AI models",
    users: "2.5k",
    rating: 4.8,
    status: 'online',
    capabilities: ['Text Generation', 'Image Understanding', 'Voice Processing'],
    modelType: 'GPT-4'
  },
  {
    id: 2,
    name: "Code Assistant",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMfEd4u69k1UATtjUV2PU9mTFKtMP4ITTLYw&s",
    type: ["Code"],
    introduction: "AI-powered coding assistant for developers",
    users: "1.8k",
    rating: 4.6,
    status: 'offline',
    capabilities: ['Code Generation', 'Code Review', 'Debugging'],
    modelType: 'GPT-3'
  },
  {
    id: 4,
    name: "Image Generator",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rhk82CINydd8t9ASEi1twWHCUXVddaOSPw&s",
    type: ["Image"],
    introduction: "Advanced AI image generation and editing",
    users: "3.1k",
    rating: 4.9,
    status: 'online',
    capabilities: ['Image Generation', 'Image Editing', 'Image Understanding'],
    modelType: 'Stable Diffusion'
  }
];

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

    const [search, setSearch] = useState('');
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

    // 从现有 Agent 的 type 中提取唯一的标签
    const labels = useMemo(() => {
        const allTypes = MOCK_AGENTS.flatMap(agent => agent.type);
        return Array.from(new Set(allTypes)).sort();
    }, []);

    // 过滤 Agents
    const filteredAgents = useMemo(() => {
        return MOCK_AGENTS.filter(agent => {
            const matchesSearch = !search ||
                agent.name.toLowerCase().includes(search.toLowerCase()) ||
                agent.introduction.toLowerCase().includes(search.toLowerCase());

            const matchesLabels = selectedLabels.length === 0 ||
                selectedLabels.some(label => agent.type.includes(label));

            return matchesSearch && matchesLabels;
        });
    }, [search, selectedLabels]);

    const toggleLabel = (label: string) => {
        setSelectedLabels(prev =>
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        );
    };

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
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search agents"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-xl border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-morphic-primary focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Labels */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {labels.map(label => (
                            <button
                                key={label}
                                onClick={() => toggleLabel(label)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLabels.includes(label)
                                    ? 'bg-morphic-primary text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Agents Grid */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        <AnimatePresence mode="wait">
                            {filteredAgents.map(agent => (
                                <motion.div
                                    key={agent.id}
                                    onClick={() => navigate(`/agent-chat/${agent.id}`, { state: { agent } })}
                                    className="bg-gray-800/50 rounded-xl border border-morphic-primary/20 overflow-hidden hover:border-morphic-primary/40 transition-all duration-300 cursor-pointer"
                                >
                                    {/* Card Header */}
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
                                            {agent.type.map(t => (
                                                <span key={t} className="px-2 py-1 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center">
                                                    <Cpu className="h-3 w-3 mr-1" />
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-sm line-clamp-2">
                                            {agent.introduction}
                                        </p>
                                    </div>

                                    {/* Card Body */}
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
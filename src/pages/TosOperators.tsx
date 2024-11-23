import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Cpu, Users, Coins, Star, MapPin } from 'lucide-react';
import PageBackground from '../components/PageBackground';

// 模拟数据
const MOCK_OPERATORS = [
  {
    id: 1,
    name: "Morphic Operator",
    logo: "/images/morphic-logo.png",
    type: ["TDX", "H100"],
    address: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488D",
    owner: {
      name: "Morphic",
      logo: "/images/morphic-logo.png"
    },
    location: "US West",
    restaked: "132",
    numStakers: "1.0k",
    numTosServing: 1,
    reputation: "High",
    introduction: "Leading TDX operator"
  },
  {
    id: 2,
    name: "Secure Computing Node",
    logo: "/images/operator2-logo.png",
    type: ["SGX"],
    address: "0x9c340d5820B4cF539739dF2C5dAcb4c659F2488E",
    owner: {
      name: "SecureNode",
      logo: "/images/operator2-logo.png"
    },
    location: "EU Central",
    restaked: "98",
    numStakers: "800",
    numTosServing: 2,
    reputation: "High",
    introduction: "Specialized in SGX computing"
  },
  // ... 可以添加更多拟数据
];

const TosOperators: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const labels = ['SGX', 'TDX', 'SEV', 'H100', 'Plain'];
  
  const toggleLabel = (label: string) => {
    setSelectedLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="relative pt-20 min-h-screen">
      <PageBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Registered Operators
          </h1>
          <p className="text-gray-400 mb-8">
            Explore and connect with trusted operators who provide secure and reliable 
            off-chain computation services through various TEE solutions
          </p>

          {/* Basic Stats */}
          <div className="grid grid-cols-3 gap-6 my-16">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {MOCK_OPERATORS.length}
              </div>
              <div className="text-gray-400">Total Operators</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                230 ETH
              </div>
              <div className="text-gray-400">Total Restaked</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                1.8K
              </div>
              <div className="text-gray-400">Total Stakers</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search operators"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-xl border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Labels */}
          <div className="flex flex-wrap gap-2 mb-8">
            {labels.map(label => (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLabels.includes(label)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Operators List Container */}
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Available Operators</h2>
              <span className="text-gray-400 text-sm">
                {MOCK_OPERATORS.length} operators found
              </span>
            </div>

            {/* Operators Grid */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {MOCK_OPERATORS.map((operator, index) => (
                  <motion.div
                    key={operator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    {/* Card Header */}
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
                              {operator.type.map(t => (
                                <span key={t} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center">
                                  <Cpu className="h-3 w-3 mr-1" />
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-400 text-sm font-mono">
                            {operator.address.slice(0, 6)}...{operator.address.slice(-4)}
                          </span>
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            Attest
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="grid grid-cols-6 gap-6">
                        {/* Owner Info */}
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

                        {/* Location */}
                        <div className="flex items-center text-gray-400">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Location</span>
                            <span className="text-sm">{operator.location}</span>
                          </div>
                        </div>

                        {/* Restaked Amount */}
                        <div className="flex items-center text-gray-400">
                          <Coins className="h-4 w-4 mr-2 text-gray-500" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Restaked</span>
                            <span className="text-sm">{operator.restaked} ETH</span>
                          </div>
                        </div>

                        {/* Number of Stakers */}
                        <div className="flex items-center text-gray-400">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Stakers</span>
                            <span className="text-sm">{operator.numStakers}</span>
                          </div>
                        </div>

                        {/* TOS Serving */}
                        <div className="flex items-center text-gray-400">
                          <Star className="h-4 w-4 mr-2 text-gray-500" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">TOS Serving</span>
                            <span className="text-sm">{operator.numTosServing}</span>
                          </div>
                        </div>

                        {/* Reputation */}
                        <div className="flex items-center text-gray-400">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Reputation</span>
                            <span className="text-sm">{operator.reputation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TosOperators;
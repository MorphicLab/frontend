import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, Users, Coins, Star, MapPin } from 'lucide-react';
import PageBackground from '../components/PageBackground';

// 模拟数据
const MOCK_OPERATORS = [
  {
    id: 1,
    name: "Morphic Operator",
    logo: "/images/morphic-logo-sm.png",
    type: ["TDX", "H100"],
    address: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488D",
    owner: {
      name: "Morphic",
      logo: "/images/morphic-logo-sm.png"
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
    name: "Secure Node",
    logo: "data:image/png;base64,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",
    type: ["SGX"],
    address: "0x9c340d5820B4cF539739dF2C5dAcb4c659F2488E",
    owner: {
      name: "SecureNode",
      logo: "data:image/png;base64,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"
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
          <h1 className="text-4xl font-bold text-morphic-light mb-2">
            Registered Operators
          </h1>

          <div className="grid grid-cols-3 gap-6 my-16">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-morphic-primary/20">
              <div className="text-3xl font-bold text-morphic-primary mb-2">
                {MOCK_OPERATORS.length}
              </div>
              <div className="text-morphic-light/80">Total Operators</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-morphic-primary/20">
              <div className="text-3xl font-bold text-morphic-primary mb-2">
                230 ETH
              </div>
              <div className="text-morphic-light/80">Total Restaked</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-morphic-primary/20">
              <div className="text-3xl font-bold text-morphic-primary mb-2">
                1.8K
              </div>
              <div className="text-morphic-light/80">Total Stakers</div>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-morphic-light/50" />
            <input
              type="text"
              placeholder="Search operators"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-xl border border-morphic-primary/20 text-white placeholder-morphic-light/50 focus:outline-none focus:ring-2 focus:ring-morphic-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {labels.map(label => (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLabels.includes(label)
                    ? 'bg-morphic-primary text-white'
                    : 'bg-gray-800/50 text-morphic-light hover:bg-morphic-primary/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {MOCK_OPERATORS.map(operator => (
              <motion.div
                key={operator.id}
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
                          {operator.type.map(t => (
                            <span key={t} className="px-2 py-1 bg-morphic-primary/20 text-morphic-light text-xs rounded-full flex items-center">
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
                      <button className="px-4 py-2 bg-morphic-primary hover:bg-morphic-accent text-white text-sm rounded-lg transition-colors">
                        Attest
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
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {[1].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-morphic-primary text-white'
                    : 'bg-gray-800/50 text-morphic-light hover:bg-morphic-primary/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TosOperators;
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Users, Coins, ThumbsUp, ExternalLink } from 'lucide-react';
import PageBackground from '../components/PageBackground';

// Mock data for demonstration
const tosData = [
  {
    id: 1,
    name: 'Morphic AI',
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    introduction: 'A decentralized AI service platform powered by trustless computation...',
    publisher: {
      name: 'Morphic Labs',
      logo: 'https://images.unsplash.com/photo-1628359355624-855775b5c9c8?w=50&h=50&fit=crop'
    },
    labels: ['DeAI', 'Compute'],
    restaked: 962,
    operators: 2,
    stakes: 1000,
    likes: 142,
    logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop'
  },
  // Add more mock data here...
];

const labels = ['DeAI', 'Compute', 'Storage', 'Network', 'Oracle'];

const TosServices = () => {
  const [search, setSearch] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredTOS = useMemo(() => {
    return tosData.filter(tos => {
      const matchesSearch = search === '' || 
        tos.name.toLowerCase().includes(search.toLowerCase()) ||
        tos.introduction.toLowerCase().includes(search.toLowerCase());
      
      const matchesLabels = selectedLabels.length === 0 ||
        selectedLabels.every(label => tos.labels.includes(label));
      
      return matchesSearch && matchesLabels;
    });
  }, [search, selectedLabels]);

  const totalPages = Math.ceil(filteredTOS.length / itemsPerPage);
  const currentTOS = filteredTOS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
    setCurrentPage(1);
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
            Registered TOSs (Trustless off-chain services)
          </h1>
          <p className="text-gray-400 mb-8">
            Discover and explore decentralized services powered by trustless computation
          </p>

          {/* Basic Stats */}
          <div className="grid grid-cols-3 gap-6 my-16">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-morphic-primary mb-2">
                {tosData.length}
              </div>
              <div className="text-gray-400">Total Services</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-morphic-primary mb-2">
                230 ETH
              </div>
              <div className="text-gray-400">Total Restaked</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-morphic-primary mb-2">
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
              placeholder="Search TOSs"
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
                    ? 'bg-morphic-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-morphic-primary/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* TOS Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence mode="wait">
              {currentTOS.map((tos, index) => (
                <Link to={`/tos-services/${tos.id}`} key={tos.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    {/* Card Header */}
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

                    {/* Card Body */}
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
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-morphic-primary text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-morphic-primary/20'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TosServices;
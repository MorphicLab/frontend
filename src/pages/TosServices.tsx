import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Users, Coins, ThumbsUp, ExternalLink } from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { MOCK_TOS, tosLabels } from '../data/mockData';
import { SearchAndFilter } from '../components/common/SearchAndFilter';
import { TOSCard } from '../components/cards/TOSCard';

const TosServices = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredTOS = useMemo(() => {
        return MOCK_TOS.filter(tos => {
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
        <div className="pt-20 min-h-screen bg-gray-900">
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
                                {MOCK_TOS.length}
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
                    <SearchAndFilter
                        search={search}
                        onSearchChange={setSearch}
                        labels={tosLabels}
                        selectedLabels={selectedLabels}
                        onLabelToggle={toggleLabel}
                        searchPlaceholder="Search TOSs"
                    />

                    {/* TOS Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <AnimatePresence mode="wait">
                            {currentTOS.map((tos, index) => (
                                <Link to={`/tos-services/${tos.id}`} key={tos.id}>
                                    <TOSCard tos={tos} index={index} />
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
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <button
                        onClick={() => navigate('/developer', { state: { activeTab: 'tos' } })}
                        className="px-8 py-3 rounded-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold transition-colors"
                    >
                        Deliver Your TOS with Morphic
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default TosServices;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageBackground from '../components/PageBackground';
import { tosLabels, MOCK_MORPHIC_AI_TOS } from '../data/mockData';
import { TOSCard } from '../components/cards/TOSCard';
import { SearchAndFilter, useSearchAndFilter } from '../components/common/SearchAndFilter';
import { useBlockchainStore } from '../components/store/chainStore';

const TosServices: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        useBlockchainStore.getState().initializeStore();
    }, []);

    const allTOS = useBlockchainStore(state => state.toss);
    const allOperators = useBlockchainStore(state => state.operators);
    const ethPrice = useBlockchainStore(state => state.ethPrice);
    const addTOS = useBlockchainStore(state => state.addTOS);

    // Handle Ctrl+V shortcut
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
                const hasMorphicAI = allTOS.some(tos => tos.name === 'Morphic AI');
                if (!hasMorphicAI) {
                    addTOS(MOCK_MORPHIC_AI_TOS);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [allTOS, addTOS]);

    // 计算总质押价值（美元）
    const totalStaked = allTOS.reduce((total, tos) => total + ((tos.restaked || 0) * ethPrice), 0);

    // Search and Filter
    const {
        search,
        setSearch,
        selectedLabels,
        toggleLabel,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: currentTOS,
    } = useSearchAndFilter(allTOS);

    console.log('currentTOS:', currentTOS);

    return (
        <div className="relative pt-20 min-h-screen">
            <PageBackground />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 介绍部分 */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-morphic-light mb-4">
                            Trustless Off-chain Services
                        </h1>
                        <p className="text-gray-400 max-w-3xl">
                            Explore and interact with decentralized services powered by trustless computation. 
                            Each service is secured by TEE technology and backed by crypto-economic incentives.
                        </p>
                    </div>

                    {/* 统计卡片 */}
                    <div className="grid grid-cols-3 gap-6 my-16">
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-morphic-primary/20">
                            <div className="text-3xl font-bold text-morphic-primary mb-2">
                                {allTOS.length}
                            </div>
                            <div className="text-morphic-light/80">Total Services</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-morphic-primary/20">
                            <div className="text-3xl font-bold text-morphic-primary mb-2">
                                {allOperators.length}
                            </div>
                            <div className="text-morphic-light/80">Active Operators</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-morphic-primary/20">
                            <div className="text-3xl font-bold text-morphic-primary mb-2">
                                ${totalStaked.toLocaleString()}
                            </div>
                            <div className="text-morphic-light/80">Total Value Locked</div>
                        </div>
                    </div>

                    <SearchAndFilter
                        search={search}
                        onSearchChange={setSearch}
                        labels={tosLabels}
                        selectedLabels={selectedLabels}
                        onLabelToggle={toggleLabel}
                        searchPlaceholder="Search services"
                    />

                    {/* TOS Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentTOS.map((tos, index) => (
                            <TOSCard
                                key={tos.id}
                                tos={tos}
                                index={index} 
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
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

                    {/* Showing entries info */}
                    <div className="text-gray-400 text-sm text-center mt-4">
                        Showing {((currentPage - 1) * 6) + 1} to {Math.min(currentPage * 6, currentTOS.length)} of {currentTOS.length} services
                    </div>

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
                            Deliver Your Service with Morphic
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default TosServices;
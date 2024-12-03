import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageBackground from '../components/PageBackground';
import { MOCK_TOS, tosLabels } from '../data/mockData';
import { TOSCard } from '../components/cards/TOSCard';
import { SearchAndFilter, useSearchAndFilter } from '../components/common/SearchAndFilter';
import { useBlockchainStore } from '../components/store/store';


const TosServices: React.FC = () => {
    const navigate = useNavigate();

    // Fetch operators when component mounts
    useEffect(() => {
        useBlockchainStore.getState().initializeStore();
      }, []);

    const registeredTOS = useBlockchainStore(state => state.toss);

    // 合并所有来源的 TOS 数据
    const allTOS = useMemo(() => {
        return [...MOCK_TOS, ...registeredTOS];
    }, [registeredTOS]);

    // 计算Operators总数
    const totalOperators = useMemo(() => {
        return allTOS.reduce((sum, tos) => {
            return sum + (tos.operators?.length || 0);
        }, 0);
    }, [allTOS]);

    // 使用搜索和过滤 hook
    const {
        search,
        setSearch,
        selectedLabels,
        toggleLabel,
        filteredItems: currentTOS,
        currentPage,
        setCurrentPage,
        totalPages
    } = useSearchAndFilter(allTOS);

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
                                {totalOperators}
                            </div>
                            <div className="text-morphic-light/80">Active Operators</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-morphic-primary/20">
                            <div className="text-3xl font-bold text-morphic-primary mb-2">
                                $25,420
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {currentTOS.map((tos, index) => (
                            <TOSCard 
                                key={`${tos.id}-${tos.name}`}  // 使用更独特的 key
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
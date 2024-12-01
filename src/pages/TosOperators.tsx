import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import { MOCK_OPERATORS, operatorLabels } from '../data/mockData';
import { SearchAndFilter, useSearchAndFilter } from '../components/common/SearchAndFilter';
import { OperatorCard } from '../components/cards/OperatorCard';
import { useBlockchainStore } from '../components/store/store';

const TosOperators: React.FC = () => {
    const navigate = useNavigate();

    // Fetch operators when component mounts
    useEffect(() => {
        useBlockchainStore.getState().fetchOperators();
    }, []);

    // Get registered operators from the store
    const registeredOperators = useBlockchainStore(state => state.operators);

    const allOperators = useMemo(() => {
        return [...MOCK_OPERATORS, ...registeredOperators];
    }, [registeredOperators]);

    const {
        search,
        setSearch,
        selectedLabels,
        toggleLabel,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: currentOperators
    } = useSearchAndFilter(allOperators);

    return (
        <div className="relative pt-20 min-h-screen">
            <PageBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* <h1 className="text-4xl font-bold text-morphic-light mb-2">
                        Registered Operators
                    </h1> */}

                    <h1 className="text-4xl font-bold text-white mb-2">
                        Registered Operators
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Discover and explore registered operators that provide computing resources for all TOSs
                    </p>

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

                    
                    <SearchAndFilter
                        search={search}
                        onSearchChange={setSearch}
                        labels={operatorLabels}
                        selectedLabels={selectedLabels}
                        onLabelToggle={toggleLabel}
                        searchPlaceholder="Search Operators"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {currentOperators.map(operator => (
                            <OperatorCard key={operator.id} operator={operator} />
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        {[1].map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-morphic-primary text-white'
                                        : 'bg-gray-800/50 text-morphic-light hover:bg-morphic-primary/20'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <button
                        onClick={() => navigate('/developer', { state: { activeTab: 'operator' } })}
                        className="px-8 py-3 rounded-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold transition-colors"
                    >
                        Deliver Your Operator with Morphic
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default TosOperators;
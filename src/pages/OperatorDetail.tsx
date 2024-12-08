import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Cpu, 
    MapPin, 
    Star, 
    Shield,
    ExternalLink 
} from 'lucide-react';
import { MOCK_OPERATORS, MOCK_TOS } from '../data/mockData';
import PageBackground from '../components/PageBackground';
import { ThinTOSCard } from '../components/cards/ThinTOSCard';
import { useBlockchainStore } from '../components/store/store';


const OperatorDetail: React.FC = () => {
    const { id } = useParams();

    // Fetch operators when component mounts
    useEffect(() => {
        useBlockchainStore.getState().fetchOperators();
    }, []);

    const registeredOperators = useBlockchainStore(state => state.operators);
    const registeredTOS = useBlockchainStore(state => state.toss);

    const allOperators = useMemo(() => {
        return [...MOCK_OPERATORS, ...registeredOperators];
    }, [registeredOperators]);

    const operator = allOperators.find(op => op.id === id);


    const allTOS = useMemo(() => {
        return [...MOCK_TOS, ...registeredTOS];
    }, [registeredTOS]);

    if (!operator) return <div>Operator not found</div>;

    // Get the TOSs served by this operator
    const servingTOSs = allTOS.filter(tos => tos.operators?.includes(operator.id));

    return (
        <div className="pt-20 min-h-screen bg-gray-900">
            <PageBackground />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Information */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={operator.logo}
                                    alt={operator.name}
                                    className="w-16 h-16 rounded-lg"
                                />
                                <div>
                                    <div className="flex items-center space-x-4">
                                        <h1 className="text-3xl font-bold text-white">
                                            {operator.name}
                                        </h1>
                                        <button 
                                            className="flex items-center space-x-1 px-3 py-1 bg-morphic-primary/10 
                                            text-morphic-primary rounded-full text-sm hover:bg-morphic-primary/20 transition-colors"
                                        >
                                            <Shield className="h-4 w-4" />
                                            <span>Verify</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center text-gray-400 mt-2">
                                        <span className="font-mono">{operator.owner.address.slice(0, 6)}...{operator.owner.address.slice(-4)}</span>
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Labels and Introduction */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {operator.labels.map(label => (
                                    <span
                                        key={label}
                                        className="px-3 py-1 bg-morphic-primary/20 text-morphic-primary text-sm rounded-full flex items-center"
                                    >
                                        <Cpu className="h-4 w-4 mr-2" />
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-300">
                                {operator.description}
                            </p>
                        </div>

                        {/* Detailed Information */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-800 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
                                <div className="flex items-center text-gray-300">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    {operator.location}
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Reputation</h2>
                                <div className="flex items-center text-gray-300">
                                    <Star className="h-5 w-5 mr-2" />
                                    {operator.reputation}
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-gray-400 mb-2">Uptime</div>
                                    <div className="text-2xl font-bold text-white">99.9%</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-2">Response Time</div>
                                    <div className="text-2xl font-bold text-white">45ms</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-2">Success Rate</div>
                                    <div className="text-2xl font-bold text-white">99.8%</div>
                                </div>
                            </div>
                        </div>

                        {/* Serving TOSs Area */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Serving TOSs</h2>
                            <div className="space-y-2 grid grid-cols-1 lg:grid-cols-1">
                                {servingTOSs.map(tos => (
                                    <ThinTOSCard key={tos.id} tos={tos} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="space-y-8">
                        {/* Stake Information */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Stake</h2>
                            <div className="flex justify-between items-center text-gray-300 mb-4">
                                <span>Total Staked</span>
                                <span className="text-xl font-bold text-white">{operator.restaked} ETH</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300 mb-4">
                                <span>Stakers</span>
                                <span className="text-xl font-bold text-white">{operator.num_stakers}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>TOS Serving</span>
                                <span className="text-xl font-bold text-white">{operator.num_tos_serving}</span>
                            </div>
                        </div>

                        {/* Owner Information */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Owner</h2>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={operator.owner.logo}
                                    alt={operator.owner.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <div className="text-white font-medium">{operator.owner.name}</div>
                                    <div className="text-gray-400 text-sm">Verified Owner</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorDetail; 
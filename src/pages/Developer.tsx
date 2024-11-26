import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    PlayCircle,
    Bot,
    Key,
    Upload,
    CircuitBoard,
    Network,
    HelpCircle,
    Plus,
    Trash2,
    Coins,
    Cpu,
    ExternalLink,
    Star,
    Users,
    MapPin,
    ThumbsUp,
    Search
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import PageBackground from '../components/PageBackground';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TOSCard } from '../components/cards/TOSCard';
import { OperatorCard } from '../components/cards/OperatorCard';
import { AgentCard } from '../components/cards/AgentCard';
import { SearchAndFilter } from '../components/common/SearchAndFilter';
import { 
    MOCK_TOS, 
    MOCK_OPERATORS, 
    MOCK_AGENTS,
    tosLabels,
    operatorLabels,
    agentLabels,
    platformLabels 
} from '../data/mockData';


// 添加子菜单类型
type TOSSubMenu = 'my-tos' | 'new-tos';
type OperatorSubMenu = 'my-operator' | 'new-operator';
type AgentSubMenu = 'my-agent' | 'new-agent';


const Developer: React.FC = () => {
    const location = useLocation();
    const activeTab = location.state?.activeTab || 'dashboard';

    const [activeMenu, setActiveMenu] = useState(activeTab);
    const [selectedPlatformTypes, setSelectedPlatformTypes] = useState<string[]>([]);
    const [tosSubMenu, setTosSubMenu] = useState<TOSSubMenu>('my-tos');
    const [operatorSubMenu, setOperatorSubMenu] = useState<OperatorSubMenu>('my-operator');
    const [agentSubMenu, setAgentSubMenu] = useState<AgentSubMenu>('my-agent');

    const togglePlatformType = (labels: string) => {
        if (selectedPlatformTypes.includes(labels)) {
            setSelectedPlatformTypes(selectedPlatformTypes.filter(t => t !== labels));
        } else {
            setSelectedPlatformTypes([...selectedPlatformTypes, labels]);
        }
    };

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

    // 渲染侧边栏
    const renderSidebar = () => (
        <div className="w-64 bg-gray-800/50 rounded-xl">
            <div className="flex flex-col p-4 space-y-6">
                {/* Dashboard */}
                <button
                    onClick={() => setActiveMenu('dashboard')}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeMenu === 'dashboard'
                        ? 'bg-morphic-primary/20 text-morphic-primary'
                        : 'text-gray-400 hover:bg-gray-700/50'
                        }`}
                >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                </button>

                {/* Develop Group */}
                <div className="space-y-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4">
                        Develop
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setActiveMenu('tos')}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all w-full ${activeMenu === 'tos'
                                ? 'bg-morphic-primary/20 text-morphic-primary'
                                : 'text-gray-400 hover:bg-gray-700/50'
                                }`}
                        >
                            <PlayCircle className="h-5 w-5" />
                            <span>TOS</span>
                        </button>
                        <span className="absolute bottom-0 right-4 text-[10px] text-gray-500">for Morphic</span>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setActiveMenu('operator')}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all w-full ${activeMenu === 'operator'
                                ? 'bg-morphic-primary/20 text-morphic-primary'
                                : 'text-gray-400 hover:bg-gray-700/50'
                                }`}
                        >
                            <Network className="h-5 w-5" />
                            <span>Operator</span>
                        </button>
                        <span className="absolute bottom-0 right-4 text-[10px] text-gray-500">for Morphic</span>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setActiveMenu('agent')}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all w-full ${activeMenu === 'agent'
                                ? 'bg-morphic-primary/20 text-morphic-primary'
                                : 'text-gray-400 hover:bg-gray-700/50'
                                }`}
                        >
                            <Bot className="h-5 w-5" />
                            <span>Agent</span>
                        </button>
                        <span className="absolute bottom-0 right-4 text-[10px] text-gray-500">for Morphic-AI</span>
                    </div>
                </div>

                {/* Personal Group */}
                <div className="space-y-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4">
                        Personal
                    </span>
                    <button
                        onClick={() => setActiveMenu('apikeys')}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all w-full ${activeMenu === 'apikeys'
                            ? 'bg-morphic-primary/20 text-morphic-primary'
                            : 'text-gray-400 hover:bg-gray-700/50'
                            }`}
                    >
                        <Key className="h-5 w-5" />
                        <span>API Keys</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // 渲染内容区域
    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <CircuitBoard className="h-8 w-8 text-morphic-primary mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">TOS Services</h3>
                                <p className="text-gray-400">5 services deployed</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <Network className="h-8 w-8 text-morphic-primary mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Operators</h3>
                                <p className="text-gray-400">12 operators registered</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <Coins className="h-8 w-8 text-morphic-primary mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Total Staked</h3>
                                <p className="text-gray-400">$25,420</p>
                            </div>
                        </div>

                        {/* Staking Details */}
                        <div className="bg-gray-800/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Staking Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" className="h-6 w-6" alt="ETH" />
                                            <span className="text-white font-medium">ETH</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">15.5 ETH staked</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-morphic-primary font-medium">$19,375</div>
                                        <p className="text-green-400 text-sm">+5.2% APR</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" className="h-6 w-6" alt="USDC" />
                                            <span className="text-white font-medium">USDC</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">6,045 USDC staked</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-morphic-primary font-medium">$6,045</div>
                                        <p className="text-green-400 text-sm">+3.8% APR</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'tos':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-white">TOS</h1>
                        <p className="text-gray-400">Manage and deploy your trustless off-chain services</p>

                        {/* 标签页切换按钮 */}
                        <div className="flex space-x-4 border-b border-gray-700">
                            <button
                                onClick={() => setTosSubMenu('my-tos')}
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${tosSubMenu === 'my-tos'
                                    ? 'text-morphic-primary'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                My TOS
                                {tosSubMenu === 'my-tos' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-morphic-primary"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setTosSubMenu('new-tos')}
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${tosSubMenu === 'new-tos'
                                    ? 'text-morphic-primary'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                New TOS
                                {tosSubMenu === 'new-tos' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-morphic-primary"></div>
                                )}
                            </button>
                        </div>

                        {/* 标签页内容 */}
                        {tosSubMenu === 'my-tos' ? (
                            <>
                                <SearchAndFilter
                                    search={search}
                                    onSearchChange={setSearch}
                                    labels={tosLabels}
                                    selectedLabels={selectedLabels}
                                    onLabelToggle={toggleLabel}
                                    searchPlaceholder="Search TOSs"
                                />
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {currentTOS.map((tos, index) => (
                                        <TOSCard key={tos.id} tos={tos} index={index} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            // 现有的 New TOS 表单内容
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold text-white">Deliver Your TOS</h1>
                                <p className="text-gray-400">Register your service on-chain to publish it, making it alive and trustless</p>

                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Service Specification</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <button className="px-4 py-2 bg-morphic-primary/20 text-morphic-primary rounded-lg flex items-center">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload docker-compose.yaml
                                            </button>
                                            <span className="text-gray-400">No file selected</span>
                                        </div>
                                        <div className="border-t border-gray-700 my-6"></div>
                                        <div className="space-y-6">
                                            {/* <h3 className="text-lg font-medium text-white mb-4">Configuration</h3> */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Service Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                        placeholder="Enter service name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Version
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                        placeholder="1.0.0"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white h-32"
                                                    placeholder="Describe your agent's capabilities"
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Platform Types
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {platformLabels.map(labels => (
                                                        <button
                                                            key={labels}
                                                            onClick={() => togglePlatformType(labels)}
                                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedPlatformTypes.includes(labels)
                                                                ? 'bg-morphic-primary text-white'
                                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                                }`}
                                                        >
                                                            {labels}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Operator Specification */}
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Operator Specification</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                                Decentralization
                                                <div
                                                    data-tooltip-id="decentralization-tip"
                                                    className="ml-2 cursor-help"
                                                >
                                                    <HelpCircle className="h-4 w-4 text-gray-500" />
                                                </div>
                                            </label>
                                            <Tooltip
                                                id="decentralization-tip"
                                                content="Minimum number of TOS nodes required"
                                                place="right"
                                            />
                                            <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                                <option value="10">10 operators</option>
                                                <option value="30">30 operators</option>
                                                <option value="50">50 operators</option>
                                                <option value="100">100 operators</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Memory Requirement
                                                </label>
                                                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                                    <option value="2">2G</option>
                                                    <option value="4">4G</option>
                                                    <option value="16">16G</option>
                                                    <option value="32">32G</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Storage Requirement
                                                </label>
                                                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                                    <option value="20">20G</option>
                                                    <option value="50">50G</option>
                                                    <option value="100">100G</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Governance Specification */}
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Governance Specification</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            DAO Contract Address (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                            placeholder="0x..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="px-6 py-3 bg-morphic-primary text-white rounded-lg font-medium">
                                        Register Service
                                    </button>
                                </div>
                            </div>
                        )}
                    </div >
                );

            case 'operator':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-white">Operator</h1>
                        <p className="text-gray-400">Manage and deploy your operators</p>

                        {/* 标签页切换按钮 */}
                        <div className="flex space-x-4 border-b border-gray-700">
                            <button
                                onClick={() => setOperatorSubMenu('my-operator')}
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${operatorSubMenu === 'my-operator'
                                    ? 'text-morphic-primary'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                My Operator
                                {operatorSubMenu === 'my-operator' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-morphic-primary"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setOperatorSubMenu('new-operator')}
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${operatorSubMenu === 'new-operator'
                                    ? 'text-morphic-primary'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                New Operator
                                {operatorSubMenu === 'new-operator' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-morphic-primary"></div>
                                )}
                            </button>
                        </div>

                        {/* 标签页内容 */}
                        {operatorSubMenu === 'my-operator' ? (
                            <>
                                <SearchAndFilter
                                    search={search}
                                    onSearchChange={setSearch}
                                    labels={operatorLabels}
                                    selectedLabels={selectedLabels}
                                    onLabelToggle={toggleLabel}
                                    searchPlaceholder="Search operators"
                                />
                                <div className="space-y-4">
                                    {MOCK_OPERATORS.map(operator => (
                                        <OperatorCard key={operator.id} operator={operator} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            // 现有的 New Operator 表单内容
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold text-white">Deliver Your Operator</h1>
                                <p className="text-gray-400">Register your operator on-chain to provision computing resources and earn rewards</p>

                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Operator Configuration</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Operator Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                placeholder="Enter operator name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Platform Types
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {platformLabels.map(labels => (
                                                    <button
                                                        key={labels}
                                                        onClick={() => togglePlatformType(labels)}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedPlatformTypes.includes(labels)
                                                            ? 'bg-morphic-primary text-white'
                                                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                            }`}
                                                    >
                                                        {labels}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    IP Address
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    placeholder="Enter IP address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Port
                                                </label>
                                                <input
                                                    labels="number"
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    placeholder="Enter port number"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Operator Icon
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-20 h-20 bg-gray-700/50 rounded-lg flex items-center justify-center border border-dashed border-gray-600">
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <button className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50">
                                                    Upload Icon
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="px-6 py-3 bg-morphic-primary text-white rounded-lg font-medium">
                                        Deploy Operator
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'agent':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-white">Agent</h1>
                        <p className="text-gray-400">Manage and deploy your AI agents</p>

                        {/* 标签页切换按钮 */}
                        <div className="flex space-x-4 border-b border-gray-700">
                            <button
                                onClick={() => setAgentSubMenu('my-agent')}
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${agentSubMenu === 'my-agent'
                                    ? 'text-morphic-primary'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                My Agent
                                {agentSubMenu === 'my-agent' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-morphic-primary"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setAgentSubMenu('new-agent')}
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${agentSubMenu === 'new-agent'
                                    ? 'text-morphic-primary'
                                    : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                New Agent
                                {agentSubMenu === 'new-agent' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-morphic-primary"></div>
                                )}
                            </button>
                        </div>

                        {/* 标签页内容 */}
                        {agentSubMenu === 'my-agent' ? (
                            <>
                                <SearchAndFilter
                                    search={search}
                                    onSearchChange={setSearch}
                                    labels={agentLabels}
                                    selectedLabels={selectedLabels}
                                    onLabelToggle={toggleLabel}
                                    searchPlaceholder="Search agents"
                                />
                                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {MOCK_AGENTS.map(agent => (
                                        <AgentCard key={agent.id} agent={agent} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            // 现有的 New Agent 表单内容
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold text-white">Deliver Your Agent</h1>
                                <p className="text-gray-400">Register your agent on-chain to make it alive and trustless</p>
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Agent Specification</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <button className="px-4 py-2 bg-morphic-primary/20 text-morphic-primary rounded-lg flex items-center">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload docker-compose.yaml
                                            </button>
                                            <span className="text-gray-400">No file selected</span>
                                        </div>
                                        <div className="border-t border-gray-700 my-6"></div>
                                        <div className="space-y-6">
                                            {/* <h3 className="text-lg font-medium text-white mb-4">Configuration</h3> */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Agent Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                        placeholder="Enter agent name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Model Type
                                                    </label>
                                                    <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                                        <option>GPT-4</option>
                                                        <option>GPT-3.5</option>
                                                        <option>Claude</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white h-32"
                                                    placeholder="Describe your agent's capabilities"
                                                ></textarea>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                {/* Operator Specification */}
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Resource Specification</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Memory Requirement
                                                </label>
                                                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                                    <option value="2">2G</option>
                                                    <option value="4">4G</option>
                                                    <option value="16">16G</option>
                                                    <option value="32">32G</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Storage Requirement
                                                </label>
                                                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white">
                                                    <option value="20">20G</option>
                                                    <option value="50">50G</option>
                                                    <option value="100">100G</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Governance Specification */}
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Governance Specification</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            DAO Contract Address (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                            placeholder="0x..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="px-6 py-3 bg-morphic-primary text-white rounded-lg font-medium">
                                        Deploy Agent
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'apikeys':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-white">API Keys</h1>
                        <p className="text-gray-400">
                            You can only access an API key when you first create it. If you lost one, you will need to create a new one.
                        </p>

                        <div className="bg-gray-800/50 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Your API Keys</h2>
                                <button className="px-4 py-2 bg-morphic-primary text-white rounded-lg flex items-center">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Key
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-gray-400 text-sm">
                                                <th className="pb-4">Key</th>
                                                <th className="pb-4">Description</th>
                                                <th className="pb-4">Created At</th>
                                                <th className="pb-4">Last Used At</th>
                                                <th className="pb-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            <tr className="border-t border-gray-700/50">
                                                <td className="py-4">vls4_pt_7...4b49</td>
                                                <td>Auto created for quick start</td>
                                                <td>2024-01-15 14:30</td>
                                                <td>2024-01-20 09:15</td>
                                                <td>
                                                    <button className="text-red-400 hover:text-red-300">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <PageBackground />

            <div className="relative z-10 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        {renderSidebar()}
                        <div className="flex-1">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Developer;

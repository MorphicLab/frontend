import { useState } from 'react';
import {
    LayoutDashboard,
    PlayCircle,
    Bot,
    Key,
    Upload,
    CircuitBoard,
    Network,
    Lock,
    HelpCircle,
    Plus,
    Trash2,
    Coins
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import PageBackground from '../components/PageBackground';
import { useLocation } from 'react-router-dom';

const Developer: React.FC = () => {
    const location = useLocation();
    const activeTab = location.state?.activeTab || 'dashboard';
    
    const [activeMenu, setActiveMenu] = useState(activeTab);
    const [selectedOperatorTypes, setSelectedOperatorTypes] = useState<string[]>([]);

    const operatorTypes = ['TDX', 'H100', 'A100', 'CPU'];

    const toggleOperatorType = (type: string) => {
        if (selectedOperatorTypes.includes(type)) {
            setSelectedOperatorTypes(selectedOperatorTypes.filter(t => t !== type));
        } else {
            setSelectedOperatorTypes([...selectedOperatorTypes, type]);
        }
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
                        <h1 className="text-3xl font-bold text-white">Deliver Your TOS</h1>
                        <p className="text-gray-400">Register your service on-chain to make it alive and trustless</p>

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
                                            Operator Types
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {operatorTypes.map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => toggleOperatorType(type)}
                                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedOperatorTypes.includes(type)
                                                        ? 'bg-morphic-primary text-white'
                                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                        }`}
                                                >
                                                    {type}
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
                );

            case 'agent':
                return (
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
                );

            case 'operator':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-white">Register Your Operator</h1>
                        <p className="text-gray-400">Register your operator to join the network and earn rewards</p>

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
                                        Operator Types
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {operatorTypes.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => toggleOperatorType(type)}
                                                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedOperatorTypes.includes(type)
                                                    ? 'bg-morphic-primary text-white'
                                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                    }`}
                                            >
                                                {type}
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
                                            type="number"
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

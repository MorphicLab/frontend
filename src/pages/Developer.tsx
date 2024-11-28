import React, { useState, useRef, useMemo } from 'react';
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
    X,
    Cpu,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import PageBackground from '../components/PageBackground';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOSCard } from '../components/cards/TOSCard';
import { AgentCard } from '../components/cards/AgentCard';
import { SearchAndFilter, useSearchAndFilter } from '../components/common/SearchAndFilter';
import {
    MOCK_TOS,
    MOCK_OPERATORS,
    MOCK_AGENTS,
    tosLabels,
    operatorLabels,
    agentLabels,
} from '../data/mockData';
import { ethers } from 'ethers';
import { ThinOperatorCard } from '../components/cards/ThinOperatorCard';
import { ThinTOSCard } from '../components/cards/ThinTOSCard';

// TOS注册合约ABI
const TOS_REGISTRY_ABI = [
    "function create_vm(address creater, string calldata name, uint128 vcpus, uint128 vmemory, uint128 disk, bytes memory docker_compose) public"
];

// TOS注册合约地址
const TOS_REGISTRY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 替换为实际合约地址

// 添加子菜单类型
type TOSSubMenu = 'my-tos' | 'new-tos';
type OperatorSubMenu = 'my-operator' | 'new-operator';
type AgentSubMenu = 'my-agent' | 'new-agent';

// 添加TOS表单状态接口
interface TOSFormState {
    name: string;
    version: string;
    description: string;
    platformTypes: string[];
    minOperators: number;
    vcpu: number;
    memory: number;
    storage: number;
    daoAddress: string;
}

// 在文件顶部添加类型声明
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string }) => Promise<string[]>;
            on: (event: string, callback: (accounts: string[]) => void) => void;
            removeListener: (event: string, callback: (accounts: string[]) => void) => void;
        };
    }
}

const Developer: React.FC = () => {
    const location = useLocation();
    const activeTab = location.state?.activeTab || 'dashboard';
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(activeTab);
    const [tosSubMenu, setTosSubMenu] = useState<TOSSubMenu>('my-tos');
    const [operatorSubMenu, setOperatorSubMenu] = useState<OperatorSubMenu>('my-operator');
    const [agentSubMenu, setAgentSubMenu] = useState<AgentSubMenu>('my-agent');

    // Add form validation state
    const [formErrors, setFormErrors] = useState({
        name: false,
        description: false,
        dockerCompose: false
    });

    // Add TOS form state
    const [tosFormState, setTosFormState] = useState<TOSFormState>({
        name: '',
        version: '',
        description: '',
        platformTypes: [],
        minOperators: 10,
        vcpu: 1,
        memory: 2,
        storage: 20,
        daoAddress: ''
    });

    // Add deploy related state
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<number | null>(null);

    const morphicAITOS = MOCK_TOS.find(tos => tos.name === 'Morphic AI');
    const availableOperators = useMemo(() => {
        // TODO: Filter the operators of Morphic AI TOS
        return MOCK_OPERATORS;
    }, []);


    const [tosFile, setTosFile] = useState<File | null>(null);
    const [agentFile, setAgentFile] = useState<File | null>(null);
    const tosFileInputRef = useRef<HTMLInputElement>(null);
    const agentFileInputRef = useRef<HTMLInputElement>(null);

    // handle TOS register
    const handleTOSRegister = async () => {
        // 验证表单
        const errors = {
            name: !tosFormState.name.trim(),
            description: !tosFormState.description.trim(),
            dockerCompose: !tosFile
        };
        
        setFormErrors(errors);

        // 如果有错误，不继续执行
        if (errors.name || errors.description || errors.dockerCompose) {
            return;
        }

        try {
            if (!window.ethereum) {
                alert('Please connect to MetaMask');
                return;
            }

            // 请求用户连接MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // 创建provider和signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();

            // 创建合约实例
            const tosRegistry = new ethers.Contract(
                TOS_REGISTRY_ADDRESS,
                TOS_REGISTRY_ABI,
                signer
            );

             // 准备 docker-compose 数据
            const dockerComposeData = tosFile ? await tosFile.arrayBuffer() : new ArrayBuffer(0);
            const dockerComposeBytes = new Uint8Array(dockerComposeData);

            // 发送交易
            console.log(dockerComposeBytes);
            const tx = await tosRegistry.create_vm(
                signer.getAddress(),                    // creater
                tosFormState.name,         // name
                tosFormState.vcpu,         // vcpus
                tosFormState.memory,       // vmemory
                tosFormState.storage,      // disk
                dockerComposeBytes         // docker_compose
            );

            // 等待交易确认
            await tx.wait();

            alert('TOS registered successfully');
            setTosSubMenu('my-tos');

        } catch (error) {
            console.error('Failed to register TOS:', error);
            alert('Failed to register TOS');
        }
    };

    // 处理表单输入变化
    const handleInputChange = (field: keyof TOSFormState, value: string | number | string[]) => {
        setTosFormState(prev => ({
            ...prev,
            [field]: value
        }));
        
        // 清除对应字段的错误状态
        if (field === 'name' || field === 'description') {
            setFormErrors(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const {
        search: tosSearch,
        setSearch: setTosSearch,
        selectedLabels: tosSelectedLabels,
        toggleLabel: toggleTosLabel,
        filteredItems: currentTOS
    } = useSearchAndFilter(MOCK_TOS);

    const {
        search: operatorSearch,
        setSearch: setOperatorSearch,
        selectedLabels: operatorSelectedLabels,
        toggleLabel: toggleOperatorLabel,
        filteredItems: currentOperators
    } = useSearchAndFilter(MOCK_OPERATORS);

    const {
        search: agentSearch,
        setSearch: setAgentSearch,
        selectedLabels: agentSelectedLabels,
        toggleLabel: toggleAgentLabel,
        filteredItems: currentAgents
    } = useSearchAndFilter(MOCK_AGENTS);

    // 处理文件上传
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
                setFile(file);
                // 清除docker-compose错误状态
                setFormErrors(prev => ({
                    ...prev,
                    dockerCompose: false
                }));
            } else {
                alert('Please upload YAML format file');
            }
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
                            renderMyTOS()
                        ) : (
                            // 新TOS表单
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold text-white">Deliver Your TOS</h1>
                                <p className="text-gray-400">Register your service on-chain to publish it, making it alive and trustless</p>

                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Service Specification</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                accept=".yaml,.yml"
                                                ref={tosFileInputRef}
                                                onChange={(e) => handleFileUpload(e, setTosFile)}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => tosFileInputRef.current?.click()}
                                                className="px-4 py-2 bg-morphic-primary/20 text-morphic-primary rounded-lg flex items-center"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload docker-compose.yaml
                                            </button>
                                            <span className={`${formErrors.dockerCompose ? 'text-red-500' : 'text-gray-400'}`}>
                                                {tosFile ? tosFile.name : 'No file selected'}
                                            </span>
                                        </div>
                                        {formErrors.dockerCompose && (
                                            <p className="text-red-500 text-sm">Please upload docker-compose file</p>
                                        )}
                                        <div className="border-t border-gray-700 my-6"></div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Service Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white ${
                                                            formErrors.name ? 'border-red-500' : 'border-gray-600'
                                                        }`}
                                                        placeholder="Enter service name"
                                                        value={tosFormState.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                    />
                                                    {formErrors.name && (
                                                        <p className="mt-1 text-sm text-red-500">Service name is required</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Version
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                        placeholder="1.0.0"
                                                        value={tosFormState.version}
                                                        onChange={(e) => handleInputChange('version', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white h-32 ${
                                                        formErrors.description ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                                    placeholder="Describe your service capabilities"
                                                    value={tosFormState.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                ></textarea>
                                                {formErrors.description && (
                                                    <p className="mt-1 text-sm text-red-500">Description is required</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Platform Types
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {operatorLabels.map(label => (
                                                        <button
                                                            key={label}
                                                            onClick={() => {
                                                                const newTypes = tosFormState.platformTypes.includes(label)
                                                                    ? tosFormState.platformTypes.filter(t => t !== label)
                                                                    : [...tosFormState.platformTypes, label];
                                                                handleInputChange('platformTypes', newTypes);
                                                            }}
                                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${tosFormState.platformTypes.includes(label)
                                                                ? 'bg-morphic-primary text-white'
                                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                                }`}
                                                        >
                                                            {label}
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
                                            <select
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                value={tosFormState.minOperators}
                                                onChange={(e) => handleInputChange('minOperators', parseInt(e.target.value))}
                                            >
                                                <option value="10">10 operators</option>
                                                <option value="30">30 operators</option>
                                                <option value="50">50 operators</option>
                                                <option value="100">100 operators</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    vCPU Requirement
                                                </label>
                                                <select
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={tosFormState.vcpu}
                                                    onChange={(e) => handleInputChange('vcpu', parseInt(e.target.value))}
                                                >
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="4">4</option>
                                                    <option value="8">8</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Memory Requirement
                                                </label>
                                                <select
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={tosFormState.memory}
                                                    onChange={(e) => handleInputChange('memory', parseInt(e.target.value))}
                                                >
                                                    <option value="2">2G</option>
                                                    <option value="4">4G</option>
                                                    <option value="8">8G</option>
                                                    <option value="16">16G</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Storage Requirement
                                                </label>
                                                <select
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={tosFormState.storage}
                                                    onChange={(e) => handleInputChange('storage', parseInt(e.target.value))}
                                                >
                                                    <option value="20">20G</option>
                                                    <option value="50">50G</option>
                                                    <option value="100">100G</option>
                                                    <option value="200">200G</option>
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
                                            value={tosFormState.daoAddress}
                                            onChange={(e) => handleInputChange('daoAddress', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleTOSRegister}
                                        className="px-6 py-3 bg-morphic-primary text-white rounded-lg font-medium"
                                    >
                                        Register Service
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                            renderMyOperator()
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
                                                {operatorLabels.map(labels => (
                                                    <button
                                                        key={labels}
                                                        onClick={() => toggleOperatorLabel(labels)}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${operatorSelectedLabels.includes(labels)
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
                                        Register Operator
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
                            renderMyAgent()
                        ) : (
                            // Agent Delivery Form
                            <div className="space-y-8">
                                <h1 className="text-3xl font-bold text-white">Deliver Your Agent</h1>
                                <p className="text-gray-400">Register your agent on-chain to make it alive and trustless</p>
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Agent Specification</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                accept=".yaml,.yml"
                                                ref={tosFileInputRef}
                                                onChange={(e) => handleFileUpload(e, setTosFile)}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => tosFileInputRef.current?.click()}
                                                className="px-4 py-2 bg-morphic-primary/20 text-morphic-primary rounded-lg flex items-center"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload docker-compose.yaml
                                            </button>
                                            <span className="text-gray-400">
                                                {tosFile ? tosFile.name : 'No file selected'}
                                            </span>
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

                                {/* Deploy button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setIsDeployModalOpen(true)}
                                        className="px-8 py-3 bg-morphic-primary text-white rounded-lg font-medium hover:bg-morphic-accent transition-colors"
                                    >
                                        Deploy Agent
                                    </button>
                                </div>

                                {/* Deploy Modal */}
                                {isDeployModalOpen && renderDeployModal()}
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

    // 处理部署
    const handleDeploy = async () => {
        if (!selectedOperator) {
            alert('Please select an operator');
            return;
        }
        // TODO: 实现实际的部署逻辑
        console.log('Deploying agent to operator:', selectedOperator);
        setIsDeployModalOpen(false);
        setSelectedOperator(null);
    };

    // 渲染部署模态框
    const renderDeployModal = () => (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsDeployModalOpen(false)}
        >
            <div
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Select Operator</h2>
                    <button
                        onClick={() => setIsDeployModalOpen(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {availableOperators.map(operator => (
                        <div
                            key={operator.id}
                            onClick={() => setSelectedOperator(operator.id)}
                            className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${selectedOperator === operator.id
                                ? 'bg-morphic-primary/20 border border-morphic-primary'
                                : 'bg-gray-700/50 hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={operator.logo}
                                        alt={operator.name}
                                        className="w-8 h-8 rounded-lg"
                                    />
                                    <span className="text-white font-medium">{operator.name}</span>
                                    <div className="flex items-center space-x-2">
                                        {operator.labels.map(label => (
                                            <span
                                                key={label}
                                                className="px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center"
                                            >
                                                <Cpu className="h-3 w-3 mr-1" />
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setIsDeployModalOpen(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeploy}
                        disabled={!selectedOperator}
                        className="px-6 py-2 bg-morphic-primary text-white rounded-lg hover:bg-morphic-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Deploy
                    </button>
                </div>
            </div>
        </div>
    );

    // TODO: Get the TOSs served by this operator
    const getServingTOSs = () => {
        return MOCK_TOS;
    };

    // 修改 My Operator 标签页的渲染函数
    const renderMyOperator = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Operators</h1>
            <p className="text-gray-400">Manage your registered operators</p>

            {/* Serving TOSs Area */}
            <div className="bg-gray-800/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">My registered operators</h2>
                <SearchAndFilter
                    search={operatorSearch}
                    onSearchChange={setOperatorSearch}
                    labels={operatorLabels}
                    selectedLabels={operatorSelectedLabels}
                    onLabelToggle={toggleOperatorLabel}
                    searchPlaceholder="Search operators"
                />

                <div className="space-y-2 grid grid-cols-1 lg:grid-cols-1">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                        {currentOperators.map(operator => (
                            <div key={operator.id} className="space-y-4 grid grid-cols-1 lg:grid-cols-1">
                                <ThinOperatorCard
                                    operator={operator}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Serving TOSs Area */}
            <div className="bg-gray-800/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Serving TOSs</h2>
                <div className="space-y-2 grid grid-cols-1 lg:grid-cols-1">
                    {getServingTOSs().map(tos => (
                        <ThinTOSCard key={tos.id} tos={tos} />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMyTOS = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My TOS</h1>
            <p className="text-gray-400">Manage your registered trustless off-chain services</p>

            <SearchAndFilter
                search={tosSearch}
                onSearchChange={setTosSearch}
                labels={tosLabels}
                selectedLabels={tosSelectedLabels}
                onLabelToggle={toggleTosLabel}
                searchPlaceholder="Search TOSs"
            />

            <div className="max-w-[900px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentTOS.map((tos, index) => (
                        <div className="max-w-[420px]">
                            <TOSCard key={tos.id} tos={tos} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMyAgent = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Agents</h1>
            <p className="text-gray-400">Manage your registered AI agents</p>

            <SearchAndFilter
                search={agentSearch}
                onSearchChange={setAgentSearch}
                labels={agentLabels}
                selectedLabels={agentSelectedLabels}
                onLabelToggle={toggleAgentLabel}
                searchPlaceholder="Search agents"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAgents.map(agent => (
                    <AgentCard
                        key={agent.id}
                        agent={agent}
                        onClick={() => navigate(`/agent-chat/${agent.id}`, { state: { agent } })}
                    />
                ))}
            </div>
        </div>
    );

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

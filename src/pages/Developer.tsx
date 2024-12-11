import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    LayoutDashboard,
    PlayCircle,
    Bot,
    Key,
    Upload,
    CircuitBoard,
    Network,
    Plus,
    Trash2,
    Coins,
    X,
    Cpu,
} from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOSCard } from '../components/cards/TOSCard';
import { AgentCard } from '../components/cards/AgentCard';
import { SearchAndFilter, useSearchAndFilter } from '../components/common/SearchAndFilter';
import {
    MOCK_TOS,
    tosLabels,
    operatorLabels,
    agentLabels,
    MOCK_MORPHIC_AI_TOS,
    MOCK_MORPHIC_OPERATOR,
    MOCK_MORPHIC_AGENT
} from '../data/mockData';
import { ethers } from 'ethers';
import { ThinOperatorCard } from '../components/cards/ThinOperatorCard';
import { ThinTOSCard } from '../components/cards/ThinTOSCard';
import { TOS, Operator, Agent, Vm, TosStatus, VmStatus, AgentStatus } from '../data/define';
import { createContractInstance } from '../request/vm'; // Import the createContractInstance function
import { deployAgent } from '../request/operator'; 
import { useBlockchainStore } from '../components/store/chainStore';
import { useOffChainStore } from '../components/store/offChainStore';
import { DEFAULT_TOS_LOGO, DEFAULT_CREATOR_LOGO, DEFAULT_OPERATOR_LOGO, DEFAULT_OPERATOR_OWNER_LOGO, DEFAULT_AGENT_LOGO } from '../data/constant';


// 添加子菜单类型
type TOSSubMenu = 'my-tos' | 'new-tos';
type OperatorSubMenu = 'my-operator' | 'new-operator';
type AgentSubMenu = 'my-agent' | 'new-agent';


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

    useEffect(() => {
        useBlockchainStore.getState().initializeStore();
        const myOperators = [MOCK_MORPHIC_OPERATOR];
        useOffChainStore.getState().initializeStore(allOperators, myOperators);
      }, []);
    
    const allOperators = useBlockchainStore(state => state.operators);

    const myOperators = useMemo(() => {
        if (!window.ethereum?.selectedAddress) return [];
        return allOperators.filter(op => 
            op.owner.address.toLowerCase() === window.ethereum.selectedAddress.toLowerCase()
        );
    }, [allOperators]);

    const morphicAiOperators = useMemo(() => {
        return allOperators.filter(op => op.vm_ids && op.vm_ids[MOCK_MORPHIC_AI_TOS.id] !== undefined);
    }, [allOperators]);

    const allTOSs = useBlockchainStore(state => state.toss);
    const myTOSs = useMemo(() => {
        if (!window.ethereum?.selectedAddress) return [];
        return allTOSs.filter(tos => 
            tos.creator.address.toLowerCase() === window.ethereum.selectedAddress.toLowerCase()
        );
    }, [allTOSs]);

    // const allAgents = useOffChainStore(state => state.allAgents);
    const myAgents = useOffChainStore(state => state.myAgents);
    if (myAgents.length > 0 && morphicAiOperators.length > 0) {
        myAgents[0].operator_domain = morphicAiOperators[0].domain; // TODO 待后台可以存储自定义字段后修改
    }

    // Add form validation state
    const [formErrors, setFormErrors] = useState({
        name: false,
        description: false,
        docker_compose: false,
        readme: false,
    });

    // Add TOS form state
    const [tosFormState, setTosFormState] = useState<TOS>({
        id: '',
        name: '',
        logo: DEFAULT_TOS_LOGO,
        description: '',
        vm_types: [],
        creator: {
            address: '',
            name: '',
            logo: DEFAULT_CREATOR_LOGO  // 使用常量
        },
        operator_minimum: 10,
        vcpus: 1,
        vmemory: 1,
        disk: 10,
        version: '',
        labels: [],
        website: '',
        code: '',
        restaked: 0,
        num_stakers: 0,
        likes: 0,
        status: TosStatus.Waiting,
    });

    // Add deploy related state
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

    // Add operator form state
    const [operatorFormState, setOperatorFormState] = useState<Operator>(
        {
            id: '',
            name: '',
            logo: DEFAULT_OPERATOR_LOGO,
            labels: [],
            description: '',
            owner: {
                address: '',
                name: '',
                logo: DEFAULT_OPERATOR_OWNER_LOGO  // 使用常量
            },
            location: '',
            domain: '',
            port: 8000,
        }
    );

    // Add operator form validation
    const [operatorFormErrors, setOperatorFormErrors] = useState({
        name: false,
        vm_types: false,
        domain: false
    });

    const availableOperators = useMemo(() => {
        const registeredOperators = useBlockchainStore.getState().operators;
        return [...registeredOperators];
    }, []);

    // 添加 agent form state
    const [agentFormState, setAgentFormState] = useState<Agent>({
        id: 0,
        owner: '',
        name: '',
        logo: DEFAULT_TOS_LOGO,
        labels: [] as string[],
        description: '',
        readme: '',
        users: '0',
        rating: 0,
        status: AgentStatus.Offline,
        model_type: '',
        memory_requirement: '',
        storage_requirement: '',
        dao_contract: '',
        visibility: '',
        docker_compose: '',
    });

    // Add agent form validation state
    const [agentFormErrors, setAgentFormErrors] = useState({
        name: false,
        description: false,
        model_type: false,
        docker_compose: false,
        readme: false
    });

    const [tosFile, setTosFile] = useState<File | null>(null);
    const [agentFile, setAgentFile] = useState<File | null>(null);
    const [agentReadmeFile, setAgentReadmeFile] = useState<File | null>(null);
    const tosFileInputRef = useRef<HTMLInputElement>(null);
    const agentFileInputRef = useRef<HTMLInputElement>(null);
    const agentReadmeFileInputRef = useRef<HTMLInputElement>(null);


    // handle TOS register
    const handleTOSRegister = async () => {
        // 验证表单
        const errors = {
            name: !tosFormState.name.trim(),
            description: !tosFormState.description?.trim(),
            docker_compose: !tosFile
        };
        
        setFormErrors(errors);
    
        if (errors.name || errors.description || errors.docker_compose) {
            return;
        }
    
        try {
            // Get contract instance
            const contract = await createContractInstance();
            
            // 准备 docker-compose 数据
            const dockerComposeData = tosFile ? await tosFile.arrayBuffer() : new ArrayBuffer(0);
            const dockerComposeBytes = new Uint8Array(dockerComposeData);
    
            console.log('Tos info: ', tosFormState);
            // 发送交易
            const tx = await contract.create_tos(
                tosFormState.name,
                tosFormState.logo,
                tosFormState.website,
                tosFormState.description,
                tosFormState.labels,
                tosFormState.vm_types,
                tosFormState.operator_minimum,
                tosFormState.creator.name,
                tosFormState.creator.logo,
                tosFormState.vcpus,
                tosFormState.vmemory,
                tosFormState.disk,
                tosFormState.version,
                dockerComposeBytes,
                tosFormState.dao || ethers.ZeroAddress,
            );
    
            console.log('Transaction sent:', tx.hash);
    
            // 等待交易确认
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            console.log('Transaction logs:', receipt.logs);
    
            alert('TOS registered successfully');
            setTosSubMenu('my-tos');
    
        } catch (error: any) {
            console.error('Failed to register TOS:', error);
            alert(`Registration failed: ${error.message || 'Unknown error'}`);
        }
    };

    // 处理表单输入变化
    const handleInputChange = (field: keyof TOS, value: any) => {
        if (field === 'creator') {
            setTosFormState(prev => ({
                ...prev,
                creator: {
                    ...prev.creator,
                    ...value,
                    logo: value.logo || DEFAULT_CREATOR_LOGO  // 添加默认值
                }
            }));
        } else if (field === 'logo') {
            setTosFormState(prev => ({
                ...prev,
                [field]: value || DEFAULT_TOS_LOGO  // 添加默认值
            }));
        } else {
            setTosFormState(prev => ({
                ...prev,
                [field]: value
            }));
        }
        
        // 清除对应字段的错误状态
        if (field === 'name' || field === 'description') {
            setFormErrors(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    // Handle operator registration
    const handleOperatorRegister = async () => {
        // Validate form
        const errors = {
            name: !operatorFormState.name.trim(),
            location: !operatorFormState.location.trim(),
        };

        setFormErrors(errors);

        if (errors.name || errors.location) {
            return;
        }

        try {
            // Get contract instance
            const contract = await createContractInstance();

            console.log('Operator info:', operatorFormState);


            // First, log all parameters before registration
            console.log('Operator info: ', operatorFormState);


            // First register the operator
            const tx = await contract.register_operator(
                operatorFormState.name,
                operatorFormState.logo || DEFAULT_OPERATOR_LOGO,
                operatorFormState.labels,
                operatorFormState.description,
                contract?.runner?.address, // Use connected wallet as owner
                operatorFormState.owner.name || '',
                operatorFormState.owner.logo || DEFAULT_OPERATOR_OWNER_LOGO,
                operatorFormState.location || '',
                operatorFormState.domain || '',
                Number(operatorFormState.port), // Ensure numeric
            );
            
            // Wait for transaction to be mined
            const receipt = await tx.wait();
            console.log('Operator Registration Transaction Receipt:', receipt);
        } catch (error) {
            console.error('Detailed Registration Error:', error);
            // More detailed error logging
            if (error instanceof Error) {
                console.error('Error Name:', error.name);
                console.error('Error Message:', error.message);
                
                // If it's an ethers error, log additional details
                if ('reason' in error) {
                    console.error('Ethers Error Reason:', (error as any).reason);
                }
                if ('code' in error) {
                    console.error('Error Code:', (error as any).code);
                }
            }
            
            // Rethrow or handle the error as needed
            throw error;
        }

        // // Update local state with the provided TOS ID
        // setOperatorFormState(prev => ({
        //     ...prev,
        //     tos_ids: tosId === "0x" + "0".repeat(32) ? [] : [tosId],
        // }));

        // Navigate to my-operator page
        setOperatorSubMenu('my-operator');
        alert('Operator registered successfully');
    };

    // Handle operator form input changes
    const handleOperatorInputChange = (field: string, value: any) => {
        setOperatorFormState(prev => {
            if (field.startsWith('owner.')) {
                const ownerField = field.split('.')[1];
                return {
                    ...prev,
                    owner: {
                        ...prev.owner,
                        [ownerField]: value
                    }
                };
            }
            return {
                ...prev,
                [field]: value
            };
        });

        // Clear corresponding error
        if (field in operatorFormErrors) {
            setOperatorFormErrors(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    // Handle agent form input changes
    const handleAgentInputChange = (field: keyof Agent, value: any) => {
        setAgentFormState(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear corresponding error
        if (field in agentFormErrors) {
            setAgentFormErrors(prev => ({
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
    } = useSearchAndFilter(myTOSs);

    const {
        search: operatorSearch,
        setSearch: setOperatorSearch,
        selectedLabels: operatorSelectedLabels,
        toggleLabel: toggleOperatorLabel,
        filteredItems: currentOperators
    } = useSearchAndFilter(myOperators);

    const {
        search: agentSearch,
        setSearch: setAgentSearch,
        selectedLabels: agentSelectedLabels,
        toggleLabel: toggleAgentLabel,
        filteredItems: currentAgents
    } = useSearchAndFilter(myAgents);

    // 处理文件上传
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
                setFile(file);
                // 清除docker-compose错误状态
                setFormErrors(prev => ({
                    ...prev,
                    docker_compose: false
                }));
            } else {
                alert('Please upload YAML format file');
            }
        }
    };
    const handleMDFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.name.endsWith('.md')) {
                setFile(file);
                setFormErrors(prev => ({
                    ...prev,
                    readme: false
                }));
            } else {
                alert('Please upload Markdown format file');
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
                                <p className="text-gray-400">{myTOSs.length} services deployed</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <Network className="h-8 w-8 text-morphic-primary mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Operators</h3>
                                <p className="text-gray-400">{myOperators.length} operators registered</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <Coins className="h-8 w-8 text-morphic-primary mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Total Staked</h3>
                                <p className="text-gray-400">$0</p>
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
                            renderMyTOSs()
                        ) : (
                            // 新TOS表单
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold text-white">Deliver Your TOS</h1>
                                <p className="text-gray-400">Register your service on-chain to publish it, making it alive and trustless</p>

                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Service Specification</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Service Name *
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
                                                    Version *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    placeholder="0.1"
                                                    value={tosFormState.version}
                                                    onChange={(e) => handleInputChange('version', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Website URL
                                            </label>
                                            <input
                                                type="url"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                placeholder="https://"
                                                value={tosFormState.website}
                                                onChange={(e) => handleInputChange('website', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Description *
                                            </label>
                                            <textarea
                                                className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white h-32 ${
                                                    formErrors.description ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="Describe your service capabilities"
                                                value={tosFormState.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                            />
                                            {formErrors.description && (
                                                <p className="mt-1 text-sm text-red-500">Description is required</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Labels
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {tosLabels.map(label => (
                                                    <button
                                                        key={label}
                                                        onClick={() => {
                                                            const newLabels = tosFormState.labels.includes(label)
                                                                ? tosFormState.labels.filter(l => l !== label)
                                                                : [...tosFormState.labels, label];
                                                            handleInputChange('labels', newLabels);
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                            tosFormState.labels.includes(label)
                                                                ? 'bg-morphic-primary text-white'
                                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Vm Types
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {operatorLabels.map(label => (
                                                    <button
                                                        key={label}
                                                        onClick={() => {
                                                            const newTypes = tosFormState.vm_types.includes(label)
                                                                ? tosFormState.vm_types.filter(t => t !== label)
                                                                : [...tosFormState.vm_types, label];
                                                            setTosFormState(prev => ({
                                                                ...prev,
                                                                vm_types: newTypes
                                                            }));
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                            tosFormState.vm_types.includes(label)
                                                                ? 'bg-morphic-primary text-white'
                                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Service Code *
                                            </label>
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
                                                    className={`px-4 py-2 rounded-lg flex items-center ${
                                                        formErrors.docker_compose 
                                                            ? 'bg-red-500/20 text-red-500 border border-red-500'
                                                            : 'bg-morphic-primary/20 text-morphic-primary hover:bg-morphic-primary/30'
                                                    }`}
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload docker-compose.yaml
                                                </button>
                                                <span className="text-gray-400">
                                                    {tosFile ? tosFile.name : 'No file selected'}
                                                </span>
                                            </div>
                                            {formErrors.docker_compose && (
                                                <p className="mt-1 text-sm text-red-500">Docker compose file is required</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Service Logo
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={tosFormState.logo}
                                                    alt="Service Logo"
                                                    className="w-20 h-20 rounded-lg object-cover bg-gray-700/50"
                                                />
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    handleInputChange('logo', reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        className="hidden"
                                                        id="logo-upload"
                                                    />
                                                    <label
                                                        htmlFor="logo-upload"
                                                        className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 cursor-pointer inline-block"
                                                    >
                                                        Upload Logo
                                                    </label>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Recommended size: 256x256px
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Requirements */}
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Resource Requirements</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Minimum Operators
                                            </label>
                                            <select
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                value={tosFormState.operator_minimum}
                                                onChange={(e) => handleInputChange('operator_minimum', parseInt(e.target.value))}
                                            >
                                                {[1, 10, 30, 50].map(num => (
                                                    <option key={num} value={num}>{num} Operator{num > 1 ? 's' : ' (testing)'}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    vCPUs
                                                </label>
                                                <select
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={tosFormState.vcpus}
                                                    onChange={(e) => handleInputChange('vcpus', parseInt(e.target.value))}
                                                >
                                                    <option value="1">1 vCPU</option>
                                                    <option value="2">2 vCPUs</option>
                                                    <option value="4">4 vCPUs</option>
                                                    <option value="8">8 vCPUs</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Memory
                                                </label>
                                                <select
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={tosFormState.vmemory}
                                                    onChange={(e) => handleInputChange('vmemory', parseInt(e.target.value))}
                                                >
                                                    <option value="1">1 GB</option>
                                                    <option value="2">2 GB</option>
                                                    <option value="4">4 GB</option>
                                                    <option value="8">8 GB</option>
                                                    <option value="16">16 GB</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Disk
                                                </label>
                                                <select
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={tosFormState.disk}
                                                    onChange={(e) => handleInputChange('disk', parseInt(e.target.value))}
                                                >
                                                    <option value="10">10 GB</option>
                                                    <option value="20">20 GB</option>
                                                    <option value="50">50 GB</option>
                                                    <option value="100">100 GB</option>
                                                </select>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* Creator Information */}
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Creator Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Creator Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                placeholder="Enter creator name"
                                                value={tosFormState.creator.name}
                                                onChange={(e) => handleInputChange('creator', { ...tosFormState.creator, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Creator Address
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                placeholder="0x..."
                                                value={tosFormState.creator.address}
                                                onChange={(e) => handleInputChange('creator', { ...tosFormState.creator, address: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Creator Logo
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={tosFormState.creator.logo}
                                                    alt="Creator Logo"
                                                    className="w-16 h-16 rounded-lg"
                                                />
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    handleInputChange('creator', {
                                                                        ...tosFormState.creator,
                                                                        logo: reader.result as string
                                                                    });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        className="hidden"
                                                        id="creator-logo-upload"
                                                    />
                                                    <label
                                                        htmlFor="creator-logo-upload"
                                                        className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 cursor-pointer inline-block"
                                                    >
                                                        Upload Logo
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Governance */}
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Governance</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            DAO Address
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                            placeholder="0x..."
                                            value={tosFormState.dao}
                                            onChange={(e) => handleInputChange('dao', e.target.value)}
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
                        <p className="text-gray-400">Register and manage your operator node</p>

                        {/* Operator tabs */}
                        <div className="flex space-x-4 border-b border-gray-700">
                            <button
                                onClick={() => setOperatorSubMenu('my-operator')}
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                                    operatorSubMenu === 'my-operator'
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
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                                    operatorSubMenu === 'new-operator'
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
                            renderMyOperators()
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Operator Registration</h2>
                                    <div className="space-y-6">
                                        {/* Basic Information */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white ${
                                                    operatorFormErrors.name ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="Enter operator name"
                                                value={operatorFormState.name}
                                                onChange={(e) => handleOperatorInputChange('name', e.target.value)}
                                            />
                                            {operatorFormErrors.name && (
                                                <p className="mt-1 text-sm text-red-500">Name is required</p>
                                            )}
                                        </div>

                                        {/* Logo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Operator Logo
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={operatorFormState.logo || DEFAULT_OPERATOR_LOGO}
                                                    alt="Operator Logo"
                                                    className="w-20 h-20 rounded-lg object-cover bg-gray-700/50"
                                                />
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    handleOperatorInputChange('logo', reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        className="hidden"
                                                        id="operator-logo-upload"
                                                    />
                                                    <label
                                                        htmlFor="operator-logo-upload"
                                                        className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 cursor-pointer inline-block"
                                                    >
                                                        Upload Logo
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Owner Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-white">Owner Information</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Owner Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    placeholder="Enter owner name"
                                                    value={operatorFormState.owner.name}
                                                    onChange={(e) => handleOperatorInputChange('owner.name', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Owner Logo
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={operatorFormState.owner.logo || DEFAULT_OPERATOR_OWNER_LOGO}
                                                        alt="Owner Logo"
                                                        className="w-16 h-16 rounded-lg"
                                                    />
                                                    <div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        handleOperatorInputChange('owner.logo', reader.result as string);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            className="hidden"
                                                            id="owner-logo-upload"
                                                        />
                                                        <label
                                                            htmlFor="owner-logo-upload"
                                                            className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 cursor-pointer inline-block"
                                                        >
                                                            Upload Logo
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                placeholder="Enter operator description"
                                                value={operatorFormState.description}
                                                onChange={(e) => handleOperatorInputChange('description', e.target.value)}
                                                rows={4}
                                            />
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                placeholder="e.g., US West"
                                                value={operatorFormState.location}
                                                onChange={(e) => handleOperatorInputChange('location', e.target.value)}
                                            />
                                        </div>

                                        {/* Operator Types */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Operator Types *
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {operatorLabels.map(label => (
                                                    <button
                                                        key={label}
                                                        onClick={() => {
                                                            const labels = operatorFormState.labels.includes(label)
                                                                ? operatorFormState.labels.filter(t => t !== label)
                                                                : [...operatorFormState.labels, label];
                                                            handleOperatorInputChange('labels', labels);
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            operatorFormState.labels.includes(label)
                                                                ? 'bg-morphic-primary text-white'
                                                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                            {operatorFormErrors.vm_types && (
                                                <p className="mt-1 text-sm text-red-500">Select at least one operator type</p>
                                            )}
                                        </div>

                                        {/* Network Configuration */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Domain *
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white ${
                                                        operatorFormErrors.domain ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                                    placeholder="e.g., operator.example.com"
                                                    value={operatorFormState.domain}
                                                    onChange={(e) => handleOperatorInputChange('domain', e.target.value)}
                                                />
                                                {operatorFormErrors.domain && (
                                                    <p className="mt-1 text-sm text-red-500">Domain is required</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Port
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    placeholder="8080"
                                                    value={operatorFormState.port}
                                                    onChange={(e) => handleOperatorInputChange('port', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleOperatorRegister}
                                                className="px-6 py-2 bg-morphic-primary text-white rounded-lg hover:bg-morphic-accent transition-colors"
                                            >
                                                Register Operator
                                            </button>
                                        </div>
                                    </div>
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
                            renderMyAgents()
                        ) : (
                            // Agent Delivery Form
                            <div className="space-y-8">
                                <h1 className="text-3xl font-bold text-white">Deliver Your Agent</h1>
                                <p className="text-gray-400">Register your agent into Morphic AI to make it trustless (verifiable, unstoppable, unruggable, etc.)</p>
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Agent Specification</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="file"
                                                accept=".yaml,.yml"
                                                ref={agentFileInputRef}
                                                onChange={(e) => handleFileUpload(e, setAgentFile)}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => agentFileInputRef.current?.click()}
                                                className={`px-4 py-2 rounded-lg flex items-center ${
                                                    agentFormErrors.docker_compose 
                                                        ? 'bg-red-500/20 text-red-500 border border-red-500'
                                                        : 'bg-morphic-primary/20 text-morphic-primary hover:bg-morphic-primary/30'
                                                }`}
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload docker-compose.yaml
                                            </button>
                                            <span className="text-gray-400">
                                                {agentFile ? agentFile.name : 'No file selected'}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-700 my-6"></div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Agent Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                        placeholder="Enter agent name"
                                                        value={agentFormState.name}
                                                        onChange={(e) => handleAgentInputChange('name', e.target.value)}
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
                                                    value={agentFormState.description}
                                                    onChange={(e) => handleAgentInputChange('description', e.target.value)}
                                                ></textarea>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="file"
                                                    accept=".md"
                                                    ref={agentReadmeFileInputRef}
                                                    onChange={(e) => handleMDFileUpload(e, setAgentReadmeFile)}
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => agentReadmeFileInputRef.current?.click()}
                                                    className={`px-4 py-2 rounded-lg flex items-center ${
                                                        agentFormErrors.readme 
                                                            ? 'bg-red-500/20 text-red-500 border border-red-500'
                                                            : 'bg-morphic-primary/20 text-morphic-primary hover:bg-morphic-primary/30'
                                                    }`}
                                                >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload README.md
                                                </button>
                                                <span className="text-gray-400">
                                                    {agentReadmeFile ? agentReadmeFile.name : 'No file selected'}
                                                </span>
                                            </div>      

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Visibility
                                                </label>
                                                <select 
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={agentFormState.visibility}
                                                    onChange={(e) => handleAgentInputChange('visibility', e.target.value)}
                                                >
                                                    <option value={'private'}>Private</option>
                                                    <option value={'public'}>Public</option>
                                                </select>
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
                                                <select 
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={agentFormState.memory_requirement}
                                                    onChange={(e) => handleAgentInputChange('memory_requirement', e.target.value)}
                                                >
                                                    <option value={'2G'}>2G</option>
                                                    <option value={'4G'}>4G</option>
                                                    <option value={'16G'}>16G</option>
                                                    <option value={'32G'}>32G</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Storage Requirement
                                                </label>
                                                <select 
                                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                                    value={agentFormState.storage_requirement}
                                                    onChange={(e) => handleAgentInputChange('storage_requirement', e.target.value)}
                                                >
                                                    <option value={'20G'}>20G</option>
                                                    <option value={'50G'}>50G</option>
                                                    <option value={'100G'}>100G</option>
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
                                            value={agentFormState.dao_contract}
                                            onChange={(e) => handleAgentInputChange('dao_contract', e.target.value)}
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
            alert('please select an operator');
            return;
        }

        try {
            // 从operators中找到完整的operator对象
            const operator = allOperators.find(op => op.id === selectedOperator);
            if (!operator) {
                throw new Error('operator not found');
            }

            // 准备 docker-compose 数据
            const docker_compose = agentFile ? await agentFile.text() : '';
            const readme = agentReadmeFile ? await agentReadmeFile.text() : '';
            

            // 准备agent部署数据
            const agentData: Agent = {
                id: Date.now(), 
                owner: window.ethereum?.selectedAddress || '',
                name: agentFormState.name,
                description: agentFormState.description,
                readme: readme,
                visibility: agentFormState.visibility,
                model_type: agentFormState.model_type,
                logo: '/images/agent-default-logo.png',
                labels: [],
                users: '0',
                rating: 0,
                status: AgentStatus.Offline,
                memory_requirement: agentFormState.memory_requirement,
                storage_requirement: agentFormState.storage_requirement,
                dao_contract: agentFormState.dao_contract || undefined,
                docker_compose: docker_compose,
            };
    
            // 调用deployAgent接口
            const response = await deployAgent(
                agentData,
                operator.domain,
                operator.port,
                docker_compose || '',
            );

            if (response) {
                console.log('Agent deployed successfully:', response);
                
                // 显示成功提示
                alert('Agent deployed successfully!');
                
                // 可选:刷新agent列表
                // refreshAgentList();
            } else {
                alert('Failed to deploy agent!');
            }
            
        } catch (error: any) {
            console.error('failed to deploy agent:', error);
            alert(`failed to deploy: ${error?.message || 'unknown error'}`);
        }

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

                <div className="max-h-96 overflow-y-auto mb-6">
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

    // Get the TOSs served by this operator
    const getServingTOSs = () => {
        const op_ids = myOperators.map(op => op.id);
        const myTOSs: TOS[] = [];
        for (let i = 0; i < op_ids.length; i++) {
            myTOSs.push(...allTOSs.filter(tos => tos.vm_ids && tos.vm_ids[op_ids[i]] !== undefined));
        }
        return myTOSs;
    };

    // 修改 My Operator 标签页的渲染函数
    const renderMyOperators = () => (
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

    const renderMyTOSs = () => (
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
                        <div key={tos.id} className="max-w-[420px]">
                            <TOSCard tos={tos} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMyAgents = () => (
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
                        onClick={() => navigate(`/agent-Chat/${agent.id}`, { state: { agent } })}
                    />
                ))}
            </div>
        </div>
    );

    // 添加键盘事件处理
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (tosSubMenu === 'new-tos' && MOCK_MORPHIC_AI_TOS) {
                if (event.ctrlKey && event.key === 'v') {
                    event.preventDefault();
                    
                    setTosFormState({
                        id: '',
                        name: MOCK_MORPHIC_AI_TOS.name || '',
                        logo: MOCK_MORPHIC_AI_TOS.logo || DEFAULT_TOS_LOGO,
                        website: MOCK_MORPHIC_AI_TOS.website || '',
                        description: MOCK_MORPHIC_AI_TOS.description || '',
                        vm_types: MOCK_MORPHIC_AI_TOS.vm_types || [],
                        creator: {
                            address: MOCK_MORPHIC_AI_TOS.creator?.address || '',
                            name: MOCK_MORPHIC_AI_TOS.creator?.name || '',
                            logo: MOCK_MORPHIC_AI_TOS.creator?.logo || DEFAULT_CREATOR_LOGO
                        },
                        operator_minimum: MOCK_MORPHIC_AI_TOS.operator_minimum || 1,
                        vcpus: MOCK_MORPHIC_AI_TOS.vcpus || 1,
                        vmemory: MOCK_MORPHIC_AI_TOS.vmemory || 1,
                        disk: MOCK_MORPHIC_AI_TOS.disk || 10,
                        version: MOCK_MORPHIC_AI_TOS.version || '',
                        code: '',
                        labels: MOCK_MORPHIC_AI_TOS.labels || [],
                        dao: MOCK_MORPHIC_AI_TOS.dao || '',
                        status: MOCK_MORPHIC_AI_TOS.status,
                    });

                    // 显示提示信息
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-morphic-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
                    notification.textContent = 'Form data pasted from template';
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }
            }

            if (operatorSubMenu === 'new-operator' && MOCK_MORPHIC_OPERATOR) {
                if (event.ctrlKey && event.key === 'v') {
                    event.preventDefault();
                    
                    setOperatorFormState({
                        ...MOCK_MORPHIC_OPERATOR,
                        // Override some fields to make them unique
                        name: `${MOCK_MORPHIC_OPERATOR.name} ${Math.floor(Math.random() * 1000)}`,
                        logo: MOCK_MORPHIC_OPERATOR.logo || DEFAULT_OPERATOR_LOGO,
                        labels: MOCK_MORPHIC_OPERATOR.labels || [],
                        description: MOCK_MORPHIC_OPERATOR.description || '',
                        owner: {
                            address: MOCK_MORPHIC_OPERATOR.owner?.address || '',  // Will be overridden by the transantion sender
                            name: MOCK_MORPHIC_OPERATOR.owner?.name || '',
                            logo: MOCK_MORPHIC_OPERATOR.owner?.logo || DEFAULT_OPERATOR_OWNER_LOGO
                        },
                        location: MOCK_MORPHIC_OPERATOR.location || '',
                        domain: MOCK_MORPHIC_OPERATOR.domain || '',
                        port: MOCK_MORPHIC_OPERATOR.port || 8000,
                    });

                    // 显示提示信息
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-morphic-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
                    notification.textContent = 'Operator template data pasted';
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }
            }

            if (agentSubMenu === 'new-agent' && MOCK_MORPHIC_AGENT) {
                if (event.ctrlKey && event.key === 'v') {
                    event.preventDefault();

                    setAgentFormState({
                        ...MOCK_MORPHIC_AGENT,
                        // Override some fields to make them unique
                        owner: MOCK_MORPHIC_AGENT.owner || '',
                        name: `${MOCK_MORPHIC_AGENT.name}_${Math.floor(Math.random() * 1000)}`,
                        logo: MOCK_MORPHIC_AGENT.logo || DEFAULT_AGENT_LOGO,
                        labels: MOCK_MORPHIC_AGENT.labels || [],
                        description: MOCK_MORPHIC_AGENT.description || '',
                        capabilities: MOCK_MORPHIC_AGENT.capabilities || [],
                    });
                    
                    // 显示提示信息
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-morphic-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
                    notification.textContent = 'Agent template data pasted';
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }
            }

        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeMenu, tosSubMenu, operatorSubMenu, agentSubMenu]);

    // 添加动画样式
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
            .animate-fade-in-out {
                animation: fadeInOut 3s ease-in-out;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

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

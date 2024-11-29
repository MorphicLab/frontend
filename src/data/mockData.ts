// 定义状态类型
export type TOSStatus = 'active' | 'waiting' | 'stopped' | 'failed';

// 定义类型
export interface TOS {
    id: number;
    name: string;
    logo: string;
    address: string;
    website?: string;
    introduction: string;
    publisher: {
        name: string;
        logo: string;
    };
    labels: string[];
    restaked: number | string;
    operators: number | string;
    stakers: number | string;
    likes: number | string;
    txHash?: string;
    status: TOSStatus;
    codeHash?: string;
}

export interface Operator {
    id: number;
    name: string;
    logo: string;
    labels: string[];
    address: string;
    owner: {
        name: string;
        logo: string;
    };
    location: string;
    restaked: string;
    numStakers: string;
    numTosServing: number;
    reputation: string;
    introduction?: string;
    codeHash?: string;
}

export interface Agent {
    id: number;
    name: string;
    logo: string;
    labels: string[];
    introduction: string;
    users: string;
    rating: number;
    status?: 'online' | 'offline';
    capabilities?: string[];
    modelType?: string;
    numOperators?: number;
}

// 标签定义
export const tosLabels = ['DeAI', 'DeFi', 'Compute', 'Storage', 'Oracle'];
export const operatorLabels = ['SGX', 'TDX', 'SEV', 'H100', 'Plain'];
export const agentLabels = ['Chat', 'Code', 'Image', 'Audio', 'Video'];

// Mock 数据
export const MOCK_TOS: TOS[] = [
    {
        id: 1,
        name: 'Morphic KMS',
        logo: '/images/kms-logo.ico',
        address: '0x86d50d5630B4cF539739dF2C5dAcb4c659F2488D',
        website: '/morphic-kms',
        introduction: 'A decentralized key management service powered by trustless computation...',
        publisher: {
            name: 'Morphic Labs',
            logo: '/images/morphic-logo-sm.png'
        },
        labels: ['Compute'],
        restaked: 962,
        operators: 32,
        txHash: '0x4160db15ac2a8ccbc0b333df207ea997b32093b5d4c9ff35e66fe9c215f51f13',
        stakers: 1023,
        likes: 512,
        status: 'active',
        codeHash: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
    {
        id: 2,
        name: 'Morphic AI',
        logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop',
        address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        website: '/morphic-ai',
        introduction: 'A decentralized AI service platform powered by trustless computation...',
        publisher: {
            name: 'Morphic Labs',
            logo: '/images/morphic-logo-sm.png'
        },
        labels: ['DeAI', 'Compute'],
        restaked: 62,
        operators: 2,
        txHash: '0x4160db15ac2a8ccbc0b333df207ea997b32093b5d4c9ff35e66fe9c215f51f13',
        stakers: 89,
        likes: 142,
        status: 'waiting',
        codeHash: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
    // ... 可以添加更多 TOS 数据
];

export const MOCK_OPERATORS: Operator[] = [
    {
        id: 1,
        name: "Morphic Operator",
        logo: "/images/morphic-logo-sm.png",
        labels: ["TDX", "H100"],
        address: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488D",
        owner: {
            name: "Morphic",
            logo: "/images/morphic-logo-sm.png"
        },
        location: "US West",
        restaked: "132",
        numStakers: "1.0k",
        numTosServing: 1,
        reputation: "High",
        introduction: "Leading TDX operator",
        codeHash: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    {
        id: 2,
        name: "Secure Node",
        logo: "/images/google-logo.png",
        labels: ["SGX"],
        address: "0x9c340d5820B4cF539739dF2C5dAcb4c659F2488E",
        owner: {
            name: "Google",
            logo: "/images/google-logo.png"
        },
        location: "EU Central",
        restaked: "98",
        numStakers: "800",
        numTosServing: 2,
        reputation: "High",
        introduction: "Specialized in SGX computing",
        codeHash: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488E"
    }
];

export const MOCK_AGENTS: Agent[] = [
    {
        id: 1,
        name: "ChatBot Agent",
        logo: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop",
        labels: ["Chat"],
        introduction: "An intelligent chatbot powered by advanced AI models",
        users: "2.5k",
        rating: 4.8,
        status: 'online',
        capabilities: ['Text Generation', 'Image Understanding', 'Voice Processing'],
        numOperators: 2,
        modelType: 'GPT-4'
      },
      {
        id: 2,
        name: "Code Assistant",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztncnxOUnTY_sw5t0_sFSYVJyXYXuPD6Ztg&s",
        labels: ["Chat", "Code"],
        introduction: "AI-powered coding assistant for developers",
        users: "1.8k",
        rating: 4.6,
        status: 'offline',
        capabilities: ['Code Generation', 'Code Review', 'Debugging'],
        modelType: 'GPT-3',
        numOperators: 2,
      },
      {
        id: 3,
        name: "Image Generator",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rhk82CINydd8t9ASEi1twWHCUXVddaOSPw&s",
        labels: ["Chat", "Image"],
        introduction: "Advanced AI image generation and editing",
        users: "3.1k",
        rating: 4.9,
        status: 'online',
        capabilities: ['Image Generation', 'Image Editing', 'Image Understanding'],
        modelType: 'Stable Diffusion',
        numOperators: 2,
      }
    // ... 可以添加更多 Agent 数据
]; 
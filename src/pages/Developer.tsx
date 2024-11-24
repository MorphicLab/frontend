import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlayCircle, 
  Key, 
  Upload, 
  Trash2,
  Info
} from 'lucide-react';
import { Tooltip } from 'antd';

// 侧边栏选项
type MenuItem = 'dashboard' | 'playground' | 'apikeys';

const Developer: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  
  // 侧边栏渲染
  const renderSidebar = () => (
    <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0 pt-20">
      <div className="flex flex-col p-4">
        <button
          onClick={() => setActiveMenu('dashboard')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            activeMenu === 'dashboard' 
              ? 'bg-morphic-primary/20 text-morphic-primary' 
              : 'text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </button>
        
        <button
          onClick={() => setActiveMenu('playground')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            activeMenu === 'playground'
              ? 'bg-morphic-primary/20 text-morphic-primary'
              : 'text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <PlayCircle className="h-5 w-5" />
          <span>Playground</span>
        </button>
        
        <button
          onClick={() => setActiveMenu('apikeys')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            activeMenu === 'apikeys'
              ? 'bg-morphic-primary/20 text-morphic-primary'
              : 'text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <Key className="h-5 w-5" />
          <span>API Keys</span>
        </button>
      </div>
    </div>
  );

  // Dashboard内容渲染
  const renderDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-gray-400 mb-2">Total TOS</h3>
          <p className="text-2xl font-bold text-white">5</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-gray-400 mb-2">Registered Operators</h3>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-gray-400 mb-2">Total Staked</h3>
          <p className="text-2xl font-bold text-white">$25,420</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Stake Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">ETH</span>
            <span className="text-white">15.5 ETH ($23,250)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">USDT</span>
            <span className="text-white">2,170 USDT</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Playground内容渲染
  const renderPlayground = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Playground</h1>
        <p className="text-gray-400">Register your service on-chain to make it alive and trustless</p>
      </div>

      {/* Service Specification */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Service Specification</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-morphic-primary/20 text-morphic-primary rounded-lg flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload docker-compose.yaml
            </button>
            <span className="text-gray-400">No file selected</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Tooltip title="Minimum number of TOS nodes required">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Decentralization</span>
              </div>
            </Tooltip>
            <select className="bg-gray-700 text-white rounded-lg px-3 py-2">
              <option>10</option>
              <option>30</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operator Specification */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Operator Specification</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 block mb-2">Type</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-morphic-primary" />
                <span className="text-white">CPU TEE</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-morphic-primary" />
                <span className="text-white">GPU TEE</span>
              </label>
              {/* ... 其他选项 ... */}
            </div>
          </div>
          
          <div>
            <label className="text-gray-400 block mb-2">Memory</label>
            <select className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full">
              <option>2G</option>
              <option>4G</option>
              <option>16G</option>
              <option>32G</option>
            </select>
          </div>
        </div>
      </div>

      {/* Governance Specification */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Governance Specification</h2>
        <input
          type="text"
          placeholder="Smart Contract Address (Optional)"
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
        />
      </div>

      <button className="w-full py-3 bg-morphic-primary text-white rounded-lg font-medium hover:bg-morphic-accent transition-colors">
        Register
      </button>
    </div>
  );

  // API Keys内容渲染
  const renderAPIKeys = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
      <p className="text-gray-400">
        You can only access an API key when you first create it. 
        If you lost one, you will need to create a new one.
      </p>

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">3 Keys</h2>
          <button className="px-4 py-2 bg-morphic-primary text-white rounded-lg">
            Create API Key
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-4">Key</th>
              <th className="pb-4">Description</th>
              <th className="pb-4">Created At</th>
              <th className="pb-4">Last Used At</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="py-4 text-white">vls4_pt_7...4b49</td>
              <td className="py-4 text-gray-400">Auto created for quick start</td>
              <td className="py-4 text-gray-400">2024-01-20 10:30</td>
              <td className="py-4 text-gray-400">2024-01-25 15:45</td>
              <td className="py-4">
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
            {/* ... 其他行 ... */}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {renderSidebar()}
      <div className="pl-64">
        <div className="max-w-7xl mx-auto px-8 py-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeMenu === 'dashboard' && renderDashboard()}
            {activeMenu === 'playground' && renderPlayground()}
            {activeMenu === 'apikeys' && renderAPIKeys()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Developer; 
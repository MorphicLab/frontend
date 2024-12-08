import React, { useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Users,
  Star,
  Cpu,
  Shield,
  Network
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip } from 'antd';
import Markdown from 'markdown-to-jsx';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  proof?: {
    hash: string;
    signature: string;
  };
  attachments?: {
    type: 'image' | 'file' | 'audio';
    url: string;
    name?: string;
  }[];
}

interface Agent {
  id: number;
  name: string;
  logo: string;
  type: string[];
  description: string;
  readme: string;
  users: string;
  rating: number;
  status?: 'online' | 'offline';
  capabilities?: string[];
  model_type?: string;
  num_operators?: number;
}

const AgentDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const agent = location.state?.agent as Agent;
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="h-16" />
      
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Agent Header */}
          <div className="border-b border-gray-800 pb-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={agent.logo} 
                  alt={agent.name}
                  className="h-12 w-12 rounded-lg"
                />
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      agent.status === 'online' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {agent.status}
                    </span>
                    <button 
                      className="flex items-center space-x-1 px-3 py-1 bg-morphic-primary/10 
                        text-morphic-primary rounded-full text-sm hover:bg-morphic-primary/20 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{agent.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{agent.users} users</span>
                </div>
                <div className="flex items-center">
                  <Network className="h-4 w-4 mr-2" />
                  <span>{agent.num_operators} operators</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-400" />
                  <span>{agent.rating}</span>
                </div>
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2" />
                  <span>{agent.model_type}</span>
                </div>
              </div>
            </div>
            
            {/* Capabilities */}
            {agent.capabilities && (
              <div className="flex items-center space-x-2 py-4">
                {agent.capabilities.map((capability, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-morphic-primary/10 text-morphic-primary rounded-full text-sm"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="h-[calc(100vh-24rem)] overflow-y-auto py-6 space-y-4">
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative max-w-[85%]">
            
                  {/* Proof Icon 和悬浮框 */}
                  {message.type === 'agent' && (
                    <Tooltip
                      placement="top"
                      overlayClassName="proof-tooltip"
                      title={
                        <div className="bg-gray-900/95 p-5 rounded-xl border border-morphic-primary/30 backdrop-blur-sm w-[800px]">
                          <div className="flex items-center space-x-2 mb-3 text-morphic-primary">
                            <Shield className="h-5 w-5" />
                            <span className="font-semibold">Proof of Correctness</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                                <div className="flex-1 h-[1px] bg-gray-700/50"></div>
                                <span>MESSAGE HASH</span>
                                <div className="flex-1 h-[1px] bg-gray-700/50"></div>
                              </div>
                              <div className="text-sm font-mono bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 break-all text-morphic-primary/90">
                                {message.proof?.hash || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D7a250d5630B4cF539739dF2C5dAcb4c659F2488D'}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                                <div className="flex-1 h-[1px] bg-gray-700/50"></div>
                                <span>SIGNATURE</span>
                                <div className="flex-1 h-[1px] bg-gray-700/50"></div>
                              </div>
                              <div className="text-sm font-mono bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 break-all text-morphic-primary/90">
                                {message.proof?.signature || '0x8a340d5630B4cF539739dF2C5dAcb4c659F2488D7a250d5630B4cF539739dF2C5dAcb4c659F2488D8a340d5630B4cF539739dF2C5dAcb4c659F2488D'}
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-400">
                              Proven by Morphic-AI at {new Date().toLocaleString()}
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <div className="absolute -bottom-2 -right-2 z-10">
                        <div className="bg-gray-900 rounded-full p-1 cursor-help border border-morphic-primary/30 group hover:bg-gray-800 transition-colors">
                          <Shield className="h-4 w-4 text-morphic-primary group-hover:text-morphic-accent transition-colors" />
                        </div>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Markdown 显示框 */}
            <div className="text-white text-lg font-semibold mb-4">README</div>
            <div className="mt-8 flex flex-row justify-between">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex-1 text-gray-400">
                <Markdown>{agent.readme}</Markdown>
              </div>
              <div className="ml-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex-2 text-gray-400 min-h-[10rem]">
                <p>{agent.description || <br/>}</p>
              </div>
            </div>
          </div>


          
        </div>
      </div>
    </div>
  );
};

export default AgentDetail; 
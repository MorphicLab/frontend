import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Send, 
  Image as ImageIcon, 
  File, 
  Mic,
  Plus,
  Bot,
  Users,
  Star,
  Cpu,
  Shield,
  CheckCircle,
  Info,
  Network
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip } from 'antd';
import { TOS, Agent, AgentStatus } from '../data/define';
import { AgentVerificationFlow } from '../components/verification/AgentVerificationFlow';
import { useBlockchainStore } from '../components/store/chainStore';
import { MOCK_MORPHIC_AI_TOS } from '../data/mockData';

const isMock = import.meta.env.VITE_MOCK === 'true';


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

const AgentChat = () => {
  const { id } = useParams();
  const location = useLocation();
  const agent = location.state?.agent as Agent;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [chatbotAgentId, setChatbotAgentId] = useState('');
  const [showVerification, setShowVerification] = useState(false);


  useEffect(() => {
    // request agentid for app api
    if (!chatbotAgentId) {
      // TODO: // https://0bd6985aadb150a147b5a592bc41f311b065c713-3000.app.kvin.wang:33005/agents
      // fetch(`https://${agent.instance_id}-${docker_port}.app.kvin.wang:${agent.operator_instance_port}/agents`)
      fetch(`/agents`)
        .then(response => response.json())
        .then(data => {
          const randomIndex = Math.floor(Math.random() * data.agents.length);
          setChatbotAgentId(data.agents[randomIndex].id);
        })
        .catch(error => console.error('Error fetching agent ID:', error));
    }
  }, [chatbotAgentId]);

    let morphicai_tos: TOS;
    const toss = useBlockchainStore(state => state.toss);
    if (!toss || toss.filter(tos => tos.name === 'Morphic AI').length === 0) {
        morphicai_tos = isMock ? MOCK_MORPHIC_AI_TOS: null;
    } else {
        morphicai_tos = toss.filter(tos => tos.name === 'Morphic AI')[0];
    }

    const operators = useBlockchainStore(state => state.operators);

    // Get Morphic AI operators and VMs
    const morphicai_operators = operators.filter(op => 
        morphicai_tos.vm_ids && 
        morphicai_tos.vm_ids[op.id] && 
        morphicai_tos.vm_ids[op.id].length > 0
    );

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    console.log();
    // request app api
    fetch(`http://66.220.6.113:33010/${chatbotAgentId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: inputMessage,
        userId: 'user',
        roomId: 'default-room-07b6bf73-fe56-0327-ad9a-9be8fa688dc3'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    })
    .then(data => {
        data.payload.forEach((item: { text: string }, index: number) => {
          const agentResponse: Message = {
            id: (Date.now() + index).toString(),
            type: 'agent',
            content: item.text,
            proof: {
              hash: data.messageHash,
              signature: data.signature
            },
            timestamp: new Date()
          };
          setMessages(prev => [...prev, agentResponse]);
        });
    })
    .catch(error => console.error('Error:', error));
    
  };

  const handleFileUpload = (type: 'image' | 'file' | 'audio') => {
    const input = {
      image: imageInputRef,
      file: fileInputRef,
      audio: audioInputRef
    }[type];
    
    input.current?.click();
  };

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
                      agent.status === AgentStatus.Offline 
                        ? 'bg-gray-500/20 text-gray-400'
                        : 'bg-green-500/20 text-green-400' 
                    }`}>
                      {AgentStatus[agent.status]?.toLowerCase()}
                    </span>
                    <button 
                      className="flex items-center space-x-1 px-3 py-1 bg-morphic-primary/10 
                        text-morphic-primary rounded-full text-sm hover:bg-morphic-primary/20 transition-colors"
                      onClick={() => setShowVerification(true)}
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
                  <span>{morphicai_operators.length} operators</span>
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

          {/* Chat Messages */}
          <div className="h-[calc(100vh-24rem)] overflow-y-auto py-6 space-y-4">
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative max-w-[85%]">
                  <div className={`rounded-lg p-4 ${
                    message.type === 'user' 
                      ? 'bg-morphic-primary text-white' 
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    {message.content}
                    {message.attachments?.map((attachment, index) => (
                      <div key={index} className="mt-2">
                        {attachment.type === 'image' && (
                          <img src={attachment.url} alt="" className="rounded-lg max-w-full" />
                        )}
                        {attachment.type === 'file' && (
                          <a href={attachment.url} className="text-blue-400 underline">
                            {attachment.name}
                          </a>
                        )}
                        {attachment.type === 'audio' && (
                          <audio src={attachment.url} controls className="w-full" />
                        )}
                      </div>
                    ))}
                  </div>

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
                                {message.proof?.hash || ''}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                                <div className="flex-1 h-[1px] bg-gray-700/50"></div>
                                <span>SIGNATURE</span>
                                <div className="flex-1 h-[1px] bg-gray-700/50"></div>
                              </div>
                              <div className="text-sm font-mono bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 break-all text-morphic-primary/90">
                                {message.proof?.signature || ''}
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
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 mt-4">
            <div className="py-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleFileUpload('image')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleFileUpload('file')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <File className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleFileUpload('audio')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-morphic-primary"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 text-morphic-primary hover:text-morphic-accent transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              // Handle image upload
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              // Handle file upload
            }}
          />
          <input
            type="file"
            ref={audioInputRef}
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              // Handle audio upload
            }}
          />
        </div>
      </div>
      {/* Verification Flow */}
      {showVerification && (
        <AgentVerificationFlow
          agent={agent}
          onClose={() => setShowVerification(false)}
        />
      )}
    </div>
  );
};

export default AgentChat; 
import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Info, Cpu } from 'lucide-react';
import { TOS, Agent, Operator, Vm } from '../../data/define';
import { useBlockchainStore } from '../store/chainStore';
import { useNavigate } from 'react-router-dom';
import { getMorphicAiTos, getMorphicAiOperators, getMorphicAiVms } from '../../tool/morphic';

interface AgentVerificationFlowProps {
    agent: Agent;
    onClose: () => void;
}

export const AgentVerificationFlow: React.FC<AgentVerificationFlowProps> = ({
    agent,
    onClose
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();

    const layout = {
        containerClass: 'w-full justify-center',
        agentWidth: 'w-[250px]',
        tosWidth: 'w-[300px]',
        operatorsWidth: 'w-[360px]',
        trustedEntitiesWidth: 'w-[300px]',
        gap: 'gap-48'
    };

    const toss = useBlockchainStore(state => state.toss);
    const operators = useBlockchainStore(state => state.operators);
    const vms = useBlockchainStore(state => state.vms);

    // Get Morphic AI TOS, operators and VMs
    const morphicai_tos: TOS = getMorphicAiTos(toss);
    const morphicai_operators: Operator[] = getMorphicAiOperators(morphicai_tos, operators);
    const morphicai_vms = getMorphicAiVms(morphicai_tos, vms);

    // Draw connections between elements
    const drawConnections = useCallback(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // Set canvas size
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale context for retina displays
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Clear previous drawings
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Get elements
        const agentCard = container.querySelector('[data-type="agent_info"]');
        const tosCard = container.querySelector('[data-type="tos_info"]');
        const agentIdField = container.querySelector('[data-field="agent-id"]');
        const tosVerifiabilityField = container.querySelector('[data-field="finality"]');

        if (!agentCard || !tosCard || !agentIdField || !tosVerifiabilityField) {
            return;
        }

        // Create gradient for line
        const createGradient = (ctx: CanvasRenderingContext2D, startX: number, endX: number, color: string) => {
            const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
            gradient.addColorStop(0, `${color}99`);    // 60% opacity
            gradient.addColorStop(0.3, `${color}66`);  // 40% opacity
            gradient.addColorStop(0.7, `${color}40`);  // 25% opacity
            gradient.addColorStop(1, `${color}26`);    // 15% opacity
            return gradient;
        };

        // Draw curved line with additional effects
        const drawCurvedLine = (startX: number, startY: number, endX: number, endY: number) => {
            const controlX = (startX + endX) / 2;

            ctx.strokeStyle = createGradient(ctx, startX, endX, '#46DCE1');
            ctx.shadowColor = 'rgba(70, 220, 225, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]);
            ctx.lineDashOffset = -performance.now() / 100;

            // Draw glow effect
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(controlX, startY, controlX, endY, endX, endY);
            ctx.stroke();

            // Draw core line with less blur
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(controlX, startY, controlX, endY, endX, endY);
            ctx.stroke();

            // Reset shadow
            ctx.shadowBlur = 8;
        };

        // Calculate relative coordinates
        const getRelativeCoords = (element: Element) => {
            const elementRect = element.getBoundingClientRect();
            return {
                left: elementRect.left - rect.left,
                right: elementRect.right - rect.left,
                top: elementRect.top - rect.top,
                bottom: elementRect.bottom - rect.top,
                width: elementRect.width,
                height: elementRect.height
            };
        };

        // Draw connection between agent ID and TOS verifiability
        const agentIdCoords = getRelativeCoords(agentIdField);
        const tosVerifiabilityCoords = getRelativeCoords(tosVerifiabilityField);
        const agentCardCoords = getRelativeCoords(agentCard);

        drawCurvedLine(
            tosVerifiabilityCoords.left,
            tosVerifiabilityCoords.top + tosVerifiabilityCoords.height / 2,
            agentCardCoords.right,
            agentCardCoords.top + 20,
        );

        requestAnimationFrame(() => drawConnections());
    }, []);

    // Start drawing after animation
    useEffect(() => {
        const animationDelay = 100;
        const timer = setTimeout(() => {
            drawConnections();
        }, animationDelay);

        return () => clearTimeout(timer);
    }, [drawConnections]);

    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #2A4157;
            border-radius: 2px;
        }
        
        .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #2A4157 transparent;
        }

        .custom-scrollbar.hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        
        .custom-scrollbar.hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        
        .custom-scrollbar.hide-scrollbar:hover {
            scrollbar-width: thin;
            -ms-overflow-style: auto;
        }
        
        .custom-scrollbar.hide-scrollbar:hover::-webkit-scrollbar {
            display: block;
        }
    `;

    return (
        <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(42, 65, 87, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(55, 86, 114, 0.6);
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(42, 65, 87, 0.5) transparent;
                }
            `}</style>
            <style>{scrollbarStyles}</style>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-[90%] h-[85%] bg-[#1B2B3A]/80 rounded-3xl overflow-hidden backdrop-blur-md"
                ref={containerRef}
                onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1,
                            opacity: 0.8,
                        }}
                    />
                </div>
                <div className="relative h-full flex justify-center gap-48 px-16">
                    {/* Agent Card */}
                    <motion.div
                        className={`${layout.agentWidth} space-y-2`}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="text-lg font-bold text-white space-y-4 py-4 mt-4">Agent</div>
                        <div data-type="agent_info" className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                            <div className="h-10 bg-gradient-to-r from-morphic-accent/20 to-morphic-primary/20 flex items-center px-4">
                                <span className="text-lg font-bold text-white">Agent Information</span>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Agent ID</div>
                                    <div data-field="agent-id" className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                        {agent.id.slice(0, 6)}...{agent.id.slice(-6)}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Agent Code</div>
                                    <div data-field="agent-code" className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                        {agent?.code_hash?.slice(0, 6)}...{agent?.code_hash?.slice(-6)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* TOS Card */}
                    <motion.div
                        className={`${layout.tosWidth} space-y-2`}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="text-lg text-white py-4 mt-4 flex items-center justify-between">
                            <span className='font-bold'>TOS</span>
                            <button
                                className="flex items-center space-x-1 px-3 py-1 bg-morphic-primary/10 
                                text-morphic-primary rounded-full text-sm hover:bg-morphic-primary/20 transition-colors"
                                onClick={() => {
                                    navigate(`/tos-services/${morphicai_tos.id}`, { state: { verify: true } });
                                    onClose();
                                }}
                            >
                                <Shield className="h-4 w-4" />
                                <span>Verify</span>
                            </button>
                        </div>
                        <div data-type="tos_info" className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                            <div className="h-10 bg-gradient-to-r from-morphic-accent/20 to-morphic-primary/20 flex items-center px-4">
                                <span className="text-lg font-bold text-white">{morphicai_tos.name}</span>
                                
                            </div>
                            <div className="p-4">
                                <div className="tos-hash">
                                    <div className="text-sm text-gray-400 mb-1">Decentralization</div>
                                    <div data-field="decentralization" className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                        {Math.min(morphicai_operators.length, morphicai_vms.length)}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-400 mb-1">Verifiability</div>
                                    <div data-field="finality" className="text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-xs">
                                        <pre className="whitespace-pre-wrap break-all text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {(morphicai_tos.address?.slice(0, 10) + '...' + (morphicai_tos.address?.slice(-10)) || 'Not available')}
                                        </pre>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-400 mb-1">Finality</div>
                                    <div data-field="verifiability" className="text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-xs">
                                        <pre className="whitespace-pre-wrap break-all text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            <div className="text-white font-mono text-sm mt-1 flex items-center">
                                                <span className="mr-2">TEE</span>
                                                <span className="flex items-center space-x-2">
                                                    {Array.from(new Set(morphicai_vms.map(vm => vm.type))).map(label => (
                                                        <span
                                                            key={label}
                                                            className="px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center"
                                                        >
                                                            <Cpu className="h-3 w-3 mr-1" />
                                                            {label}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        </pre>
                                    </div>
                                    
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-400 mb-1">Confidentiality</div>
                                    <div data-field="confidentiality" className="text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-xs">
                                        <pre className="whitespace-pre-wrap break-all text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            <div className="text-white font-mono text-sm mt-1 flex items-center">
                                                <span className="mr-2">TEE</span>
                                                <span className="flex items-center space-x-2">
                                                    {Array.from(new Set(morphicai_vms.map(vm => vm.type))).map(label => (
                                                        <span
                                                            key={label}
                                                            className="px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center"
                                                        >
                                                            <Cpu className="h-3 w-3 mr-1" />
                                                            {label}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

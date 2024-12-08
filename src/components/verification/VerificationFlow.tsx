import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOS, Operator, Vm } from '../../data/mockData';
import { Users, Coins, Star, MapPin, Cpu } from 'lucide-react';

interface VerificationFlowProps {
    tos: TOS;
    operators: Operator[];
    vms: Vm[];
    onClose: () => void;
}

export const VerificationFlow: React.FC<VerificationFlowProps> = ({
    tos,
    operators: operatorsList,
    vms,
    onClose
}) => {
    const [expandedSections, setExpandedSections] = useState<{[key: string]: {quote: boolean, tcb: boolean}}>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const operatorsRef = useRef<HTMLDivElement>(null);
    const tosHashRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const toggleSection = (operatorId: string, section: 'quote' | 'tcb') => {
        setExpandedSections(prev => ({
            ...prev,
            [operatorId]: {
                ...prev[operatorId],
                [section]: !prev[operatorId]?.[section]
            }
        }));
    };

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

        // Get all elements
        const tosCard = container.querySelector('[data-type="tos_info"]');
        const operatorCards = Array.from(container.querySelectorAll('[data-type="operator"]'));
        const intelElements = Array.from(container.querySelectorAll('[data-type="intel"]'));
        const amdElements = Array.from(container.querySelectorAll('[data-type="amd"]'));
        const ethereumCard = container.querySelector('[data-type="ethereum"]');

        if (!tosCard || operatorCards.length === 0 || intelElements.length === 0 || !ethereumCard) {
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
        const drawCurvedLine = (startX: number, startY: number, endX: number, endY: number, type: 'ethereum' | 'verification' = 'verification') => {
            const controlX = (startX + endX) / 2;
            
            // Set line style based on type
            if (type === 'ethereum') {
                ctx.strokeStyle = createGradient(ctx, startX, endX, '#EAB308'); // Yellow for Ethereum
                ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
                ctx.lineWidth = 2.5;
            } else {
                ctx.strokeStyle = createGradient(ctx, startX, endX, '#46DCE1'); // Default color
                ctx.shadowColor = 'rgba(70, 220, 225, 0.3)';
                ctx.lineWidth = 2;
            }

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

        // Draw connections for each operator
        operatorCards.forEach((operatorCard) => {
            const operatorType = operatorCard.getAttribute('data-operator-type');

            // Draw connection for Ethereum
            const ethereumCoords = getRelativeCoords(ethereumCard);
            const operatorCoords = getRelativeCoords(operatorCard);
            const tosCoords = getRelativeCoords(tosCard);

            // Draw Ethereum endorsement connection with special style
            drawCurvedLine(
                ethereumCoords.left,
                ethereumCoords.top + 20,
                operatorCoords.right,
                operatorCoords.top + 20,
                'ethereum'
            );

            drawCurvedLine(
                operatorCoords.left,
                operatorCoords.top + 20,
                tosCoords.right,
                tosCoords.top + 20,
                'ethereum'
            );

            // Vendor connection for operators
            if (operatorType === 'TDX') {
                const intelCard = intelElements[0];
                const intelCoords = getRelativeCoords(intelCard);
                const operatorCoords = getRelativeCoords(operatorCard);
                
                drawCurvedLine(
                    intelCoords.left,
                    intelCoords.top + 20,
                    operatorCoords.right,
                    operatorCoords.top + 20
                );
            } else if (operatorType === 'SEV') {
                const amdCard = amdElements[0];
                const amdCoords = getRelativeCoords(amdCard);
                const operatorCoords = getRelativeCoords(operatorCard);
                
                drawCurvedLine(
                    amdCoords.left,
                    amdCoords.top + 20,
                    operatorCoords.right,
                    operatorCoords.top + 20
                );
            }

            // Draw other connections
            const codeHashElem = operatorCard.querySelector('[data-field="code-hash"]');
            const tosCodeHashElem = tosCard.querySelector('[data-field="code-hash"]');
            if (codeHashElem && tosCodeHashElem) {
                const codeHashCoords = getRelativeCoords(codeHashElem);
                const tosCodeHashCoords = getRelativeCoords(tosCodeHashElem);
                drawCurvedLine(
                    codeHashCoords.left,
                    codeHashCoords.top + codeHashCoords.height / 2,
                    tosCodeHashCoords.right,
                    tosCodeHashCoords.top + tosCodeHashCoords.height / 2
                );
            }

            const caCertElem = operatorCard.querySelector('[data-field="ca-cert"]');
            const tosCertElem = tosCard.querySelector('[data-field="cert"]');
            if (caCertElem && tosCertElem) {
                const caCertCoords = getRelativeCoords(caCertElem);
                const tosCertCoords = getRelativeCoords(tosCertElem);
                drawCurvedLine(
                    caCertCoords.left,
                    caCertCoords.top + caCertCoords.height / 2,
                    tosCertCoords.right,
                    tosCertCoords.top + tosCertCoords.height / 2
                );
            }

            const reportDataElem = operatorCard.querySelector('[data-field="report-data"]');
            const tosAddressElem = tosCard.querySelector('[data-field="address"]');
            if (reportDataElem && tosAddressElem) {
                const reportDataCoords = getRelativeCoords(reportDataElem);
                const tosAddressCoords = getRelativeCoords(tosAddressElem);
                drawCurvedLine(
                    reportDataCoords.left,
                    reportDataCoords.top + reportDataCoords.height / 2,
                    tosAddressCoords.right,
                    tosAddressCoords.top + tosAddressCoords.height / 2
                );
            }


        });

        requestAnimationFrame(() => drawConnections());
    }, []);

    // Start drawing after animation
    useEffect(() => {
        const animationDelay = 500;
        const timer = setTimeout(() => {
            drawConnections();
        }, animationDelay);

        return () => clearTimeout(timer);
    }, [drawConnections]);

    // Handle operator container scroll
    useEffect(() => {
        const operatorsContainer = operatorsRef.current;
        if (!operatorsContainer) return;

        const handleScroll = () => {
            drawConnections();
        };

        operatorsContainer.addEventListener('scroll', handleScroll);
        return () => operatorsContainer.removeEventListener('scroll', handleScroll);
    }, [operatorsList, drawConnections]);

    const layout = {
        containerClass: 'w-full justify-center',
        tosWidth: 'w-[300px]',
        operatorsWidth: 'w-[360px]',
        trustedEntitiesWidth: 'w-[300px]',
        gap: 'gap-48'
    };

    // 添加自定义滚动条样式
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

        /* hide scrollbar by default */
        .custom-scrollbar.hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        
        .custom-scrollbar.hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        
        /* show scrollbar on hover */
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
                            opacity: 0.8,  // 降低整体画布透明度
                        }}
                    />
                </div>
                <div className={`relative h-full flex ${layout.containerClass} ${layout.gap} px-16`}>
                    {/* Ethereum Endorsement */}
                    {/* <motion.div
                        data-type="ethereum"
                        className={`${layout.trustedEntitiesWidth} space-y-2`}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="text-lg font-bold text-white space-y-4 py-4 mt-4">Ethereum Endorsement</div>
                        <div className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                            <div className="h-10 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 flex items-center px-4">
                                <span className="text-lg font-bold text-yellow-500">Ethereum Mainnet</span>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Smart Contract</div>
                                    <div data-field="contract" className="text-yellow-500 font-mono bg-yellow-500/10 px-3 py-1.5 rounded-lg text-sm">
                                        Morphic Registry
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Verification Method</div>
                                    <div data-field="verification" className="text-yellow-500 font-mono bg-yellow-500/10 px-3 py-1.5 rounded-lg text-sm">
                                        Zero Knowledge Proof
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 mb-1">Consensus</div>
                                    <div data-field="consensus" className="text-yellow-500 font-mono bg-yellow-500/10 px-3 py-1.5 rounded-lg text-sm">
                                        Proof of Stake
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </motion.div> */}

                    {/* TOS Card */}
                    <motion.div
                        className={`${layout.tosWidth} space-y-2`}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="text-lg font-bold text-white space-y-4 py-4  mt-4">TOS</div>
                        <div data-type="tos_info" className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                            <div className="h-10 bg-gradient-to-r from-morphic-accent/20 to-morphic-primary/20 flex items-center px-4">
                                <span className="text-lg font-bold text-white">{tos.name}</span>
                            </div>
                            <div className="p-4">
                                <div className="tos-hash" ref={tosHashRef}>
                                    <div className="text-sm text-gray-400 mb-1">Code Hash</div>
                                    <div data-field="code-hash" className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                        {tos.code_hash?.slice(0, 10)}...{tos.code_hash?.slice(-8)}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-400 mb-1">Certificate</div>
                                    <div data-field="cert" className="text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-xs">
                                        <pre className="whitespace-pre-wrap break-all text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {tos.cert || 'Not available'}
                                        </pre>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-400 mb-1">Address</div>
                                    <div data-field="address" className="text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-xs">
                                        <pre className="whitespace-pre-wrap break-all text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {tos.address || 'Not available'}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Operators */}
                    <div 
                        ref={operatorsRef}
                        className={`${layout.operatorsWidth} h-full overflow-y-auto custom-scrollbar hide-scrollbar space-y-2`}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="text-lg font-bold text-white mb-2 sticky top-0 z-10 space-y-4 py-4  mt-4">Serving Operators</div>
                        <div className="space-y-4 pr-2">
                            {operatorsList.map((operator, index) => (
                                <motion.div
                                    key={operator.id}
                                    data-type="operator"
                                    data-operator-type={vms.find(vm => vm.operator_id === operator.id)?.type}
                                    className="operator-card bg-[#1E3448]/90 rounded-lg overflow-hidden shadow-lg space-y-2"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <div className="h-9 bg-gradient-to-r from-morphic-accent/20 to-morphic-primary/20 flex items-center px-3">
                                        <span className="text-base font-bold text-white">{operator.name}</span>
                                    </div>
                                    <div className="p-2.5 space-y-1">

                                        {/* TCB Info Section */}
                                        <div className="tcb-section bg-morphic-primary/5 rounded-lg p-3">
                                            <div 
                                                className="text-xs text-gray-400 mb-2 cursor-pointer flex items-center"
                                                onClick={() => toggleSection(operator.id, 'tcb')}
                                            >
                                                <div className="flex-1">VM Info</div>
                                                <div className="text-morphic-primary">
                                                    {expandedSections[operator.id]?.tcb ? '▼' : '▶'}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                {vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info && (
                                                    <>
                                                        {/* Default visible field */}
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">RTMR3</div>
                                                            <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr3?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr3?.slice(-8)}
                                                            </div>
                                                        </div>

                                                        {/* Expandable fields */}
                                                        {expandedSections[operator.id]?.tcb && (
                                                            <>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">Rootfs Hash</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.roots_hash?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.roots_hash?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">MRTD</div>
                                                                    <div data-field="mrtd" className="mrtd-value text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.mrtd?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.mrtd?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">RTMR0</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr0?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr0?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">RTMR1</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr1?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr1?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">RTMR2</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr2?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tcb_info?.rtmr2?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* TOS Info Section */}
                                        <div className="tos-section bg-morphic-accent/5 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-2">TOS Info</div>
                                            <div className="space-y-1.5">
                                                {vms.find(vm => vm.operator_id === operator.id)?.report.tos_info && (
                                                    <>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">Code Hash</div>
                                                            <div data-field="code-hash" className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator_id === operator.id)?.report.tos_info?.code_hash?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tos_info?.code_hash?.slice(-8)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">CA-Certificate</div>
                                                            <div data-field="ca-cert" className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator_id === operator.id)?.report.tos_info?.ca_cert_hash?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.tos_info?.ca_cert_hash?.slice(-8)}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quote Section */}
                                        <div className="quote-section bg-morphic-accent/5 rounded-lg p-3">
                                            <div 
                                                className="text-xs text-gray-400 mb-2 cursor-pointer flex items-center"
                                                onClick={() => toggleSection(operator.id, 'quote')}
                                            >
                                                <div className="flex-1">Quote</div>
                                                <div className="text-morphic-primary">
                                                    {expandedSections[operator.id]?.quote ? '▼' : '▶'}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                {vms.find(vm => vm.operator_id === operator.id)?.report.quote && (
                                                    <>
                                                        {/* Default visible fields */}
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">TD info hash</div>
                                                            <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator_id === operator.id)?.report.quote?.td_info_hash?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.quote?.td_info_hash?.slice(-8)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">Report data</div>
                                                            <div data-field="report-data" className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs quote-report-data">
                                                                {vms.find(vm => vm.operator_id === operator.id)?.report.quote?.report_data?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.quote?.report_data?.slice(-8)}
                                                            </div>
                                                        </div>

                                                        {/* Expandable fields */}
                                                        {expandedSections[operator.id]?.quote && (
                                                            <>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">Type</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.quote?.type?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.quote?.type?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">Cpu svn</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.quote?.cpu_svn?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.quote?.cpu_svn?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">TCB hash</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.quote?.tcb_hash?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.quote?.tcb_hash?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] text-gray-400">Signature</div>
                                                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                        {vms.find(vm => vm.operator_id === operator.id)?.report.quote?.signature?.slice(0, 10)}...{vms.find(vm => vm.operator_id === operator.id)?.report.quote?.signature?.slice(-8)}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Trusted Entities */}
                    <motion.div 
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={layout.trustedEntitiesWidth + ' flex flex-col items-start space-y-2'}  
                    >
                        <div className="text-lg font-bold text-white space-y-4 py-4 mt-4">Decentralized Trust Roots</div>
                        <div className="space-y-16 w-full">  
                            {/* Ethereum Blockchain */}
                            {/* <div className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                                <div className="h-10 bg-gradient-to-r from-yellow-500/30 to-yellow-300/30 flex items-center px-4">
                                    <Coins className="w-5 h-5 text-morphic-primary mr-2" />
                                    <span className="text-base font-bold text-white">Ethereum</span>
                                </div>
                                <div className="p-3">
                                    <div className="text-[11px] text-gray-400">Chain ID</div>
                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                        1 (Mainnet)
                                    </div>
                                </div>
                            </div> */}

                            {/* Ethereum Blockchain */}
                            <div data-type="ethereum" className="bg-[#1E3448]/90 rounded-xl overflow-hidden shadow-lg">
                                <div className="h-10 bg-gradient-to-r from-yellow-500/30 to-yellow-300/30 flex items-center px-4">
                                    <Coins className="w-5 h-5 text-morphic-primary mr-2" />
                                    <span className="text-lg font-bold text-yellow-500">Ethereum</span>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Consensus</div>
                                        <div data-field="consensus" className="text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1 rounded text-xs">
                                            Proof of Stake
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Smart Contract</div>
                                        <div data-field="contract" className="text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1 rounded text-xs">
                                            Morphic Registry
                                        </div>
                                    </div>
                                    {/* <div>
                                        <div className="text-sm text-gray-400 mb-1">Verification Method</div>
                                        <div data-field="verification" className="text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1 rounded text-xs">
                                            Zero Knowledge Proof
                                        </div>
                                    </div> */}
                                    
                                </div>
                            </div>

                            {/* Intel Card */}
                            <div data-type="intel" className="bg-[#1E3448]/90 rounded-xl overflow-hidden shadow-lg">
                                <div className="h-10 bg-gradient-to-r from-yellow-500/30 to-yellow-300/30 flex items-center px-4">
                                    <Cpu className="w-5 h-5 text-morphic-primary mr-2" />
                                    <span className="text-base font-bold text-white">Intel</span>
                                </div>
                                <div className="p-3">
                                    <div className="text-sm text-gray-400 mb-1">Product</div>
                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                        TDX, SGX
                                    </div>
                                </div>
                            </div>

                            {/* AMD Card */}
                            <div data-type="amd" className="bg-[#1E3448]/90 rounded-xl overflow-hidden shadow-lg">
                                <div className="h-10 bg-gradient-to-r from-yellow-500/30 to-yellow-300/30 flex items-center px-4">
                                    <Cpu className="w-5 h-5 text-morphic-primary mr-2" />
                                    <span className="text-base font-bold text-white">AMD</span>
                                </div>
                                <div className="p-3">
                                    <div className="text-sm text-gray-400 mb-1">Product</div>
                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                        SEV
                                    </div>
                                </div>
                            </div>

                            {/* NVIDIA Card */}
                            <div className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                                <div className="h-10 bg-gradient-to-r from-yellow-500/30 to-yellow-300/30 flex items-center px-4">
                                    <Cpu className="w-5 h-5 text-morphic-primary mr-2" />
                                    <span className="text-base font-bold text-white">NVIDIA</span>
                                </div>
                                <div className="p-3">
                                    <div className="text-sm text-gray-400 mb-1">Product</div>
                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                        H100, H200
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

// 信息项组件
const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
}> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2">
        <div className="text-gray-400">{icon}</div>
        <div>
            <div className="text-xs text-gray-400">{label}</div>
            <div className="text-sm text-white">{value}</div>
        </div>
    </div>
); 
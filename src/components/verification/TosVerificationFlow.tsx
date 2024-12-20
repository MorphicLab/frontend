import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOS, Operator, Vm } from '../../data/mockData';
import { Users, Coins, Star, MapPin, Cpu } from 'lucide-react';
import { TDReport10 } from '../../tool/quote';

const isMock = import.meta.env.VITE_DATA_MOCK === 'true';

interface VerificationFlowProps {
    tos: TOS;
    operators: Operator[];
    vms: Vm[];
    onClose: () => void;
}

export const VerificationFlow: React.FC<VerificationFlowProps> = ({
    tos,
    operators,
    vms,
    onClose
}) => {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: { quote: boolean, tcb: boolean } }>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const operatorsRef = useRef<HTMLDivElement>(null);
    const tosHashRef = useRef<HTMLDivElement>(null);
    // const [isDrawing, setIsDrawing] = useState(false);

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
        const amazonElements = Array.from(container.querySelectorAll('[data-type="amazon"]'));
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
            const vmType = operatorCard.getAttribute('data-vm-type');

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

            const tosDecentralizationElem = tosCard.querySelector('[data-field="decentralization"]');
            if (tosDecentralizationElem) {
                const tosDecentralizationCoords = getRelativeCoords(tosDecentralizationElem);
                drawCurvedLine(
                    operatorCoords.left,
                    operatorCoords.top + 20,
                    tosDecentralizationCoords.right,
                    tosDecentralizationCoords.top + tosDecentralizationCoords.height / 2,
                    'ethereum'
                );
            }

            // Vendor connection for operators
            const vendorMapping = {
                'TDX': intelElements[0],
                'SEV': amdElements[0],
                'Nitro': amazonElements[0]
            };

            if (vendorMapping[vmType]) {
                const vendorCard = vendorMapping[vmType];
                const vendorCoords = getRelativeCoords(vendorCard);
                const operatorCoords = getRelativeCoords(operatorCard);

                drawCurvedLine(
                    vendorCoords.left,
                    vendorCoords.top + 20,
                    operatorCoords.right,
                    operatorCoords.top + 20
                );
            }

            // Draw other connections
            const codeHashElem = operatorCard.querySelector('[data-field="code-hash"]');
            const tosVerifiabilityElem = tosCard.querySelector('[data-field="verifiability"]');
            if (codeHashElem && tosVerifiabilityElem) {
                const codeHashCoords = getRelativeCoords(codeHashElem);
                const tosVerifiabilityCoords = getRelativeCoords(tosVerifiabilityElem);
                drawCurvedLine(
                    codeHashCoords.left,
                    codeHashCoords.top + codeHashCoords.height / 2,
                    tosVerifiabilityCoords.right,
                    tosVerifiabilityCoords.top + tosVerifiabilityCoords.height / 2
                );
            }

            const caCertElem = operatorCard.querySelector('[data-field="cert"]');
            const tosCertElem = tosCard.querySelector('[data-field="confidentiality"]');
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
            const tosAddressElem = tosCard.querySelector('[data-field="finality"]');
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
    }, [operators, drawConnections]);

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


    // Get 5 nearest operators based on current hybrid position
    const getNearestOperators = (allOperators: Operator[], currentPosition: number) => {
        // Sort operators based on their position in the list
        // This is a simplified distance calculation, you can modify it based on your needs
        const sortedOperators = [...allOperators].sort((a, b) => {
            const indexA = allOperators.indexOf(a);
            const indexB = allOperators.indexOf(b);
            return Math.abs(indexA - currentPosition) - Math.abs(indexB - currentPosition);
        });

        // Return only the 5 nearest operators
        return sortedOperators.slice(0, 5);
    };

    // Get current hybrid position (for demo, using the middle of the list)
    const currentPosition = Math.floor(operators.length / 2);
    
    // Get the 5 nearest operators
    // TODO: This should be updated based on the current hybrid position
    const nearestOperators = getNearestOperators(operators, currentPosition);

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
                                    <div className="text-sm text-gray-400 mb-1">Decentralization</div>
                                    <div data-field="decentralization" className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                        {Math.min(operators.length, vms.length)}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-400 mb-1">Verifiability</div>
                                    <div data-field="finality" className="text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-xs">
                                        <pre className="whitespace-pre-wrap break-all text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {tos.address || 'Not available'}
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
                                                    {Array.from(new Set(vms.map(vm => vm.type))).map(label => (
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
                                                    {Array.from(new Set(vms.map(vm => vm.type))).map(label => (
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
                            {nearestOperators.map((operator, index) => {
                                const vm = vms.find(vm => vm.operator_id === operator.id);
                                // TODO: now we assume the vm reporrt is a TD report, should be decoded according to TD type next
                                let quote_report = vm?.quote?.report as TDReport10;

                                // TODO: remove
                                const generateRandomHex = (length: number) => Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                                return (
                                    <motion.div
                                        key={operator.id}
                                        data-type="operator"
                                        data-vm-type={vm?.type}
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
                                                    {quote_report && (
                                                        <>
                                                            {/* Default visible field */}
                                                            <div>
                                                                <div className="text-[11px] text-gray-400">RTMR3</div>
                                                                <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                    {/* {quote_report.rtMr3?.slice(0, 10)}...{quote_report.rtMr3?.slice(-8)} */}
                                                                    {tos.name === 'Morphic AI' ? `${quote_report.rtMr3?.slice(0, 10)}...${quote_report.rtMr3?.slice(-8)}` : `${quote_report.rtMr3?.slice(11, 21)}...${quote_report.rtMr3?.slice(22, 30)}`}
                                                                </div>
                                                            </div>

                                                            {/* Expandable fields */}
                                                            {expandedSections[operator.id]?.tcb && (
                                                                <>
                                                                    {/* <div>
                                                                        <div className="text-[11px] text-gray-400">Rootfs Hash</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {tcbInfo.roots_hash?.slice(0, 10)}...{tcbInfo.roots_hash?.slice(-8)}
                                                                        </div>
                                                                    </div> */}
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">MRTD</div>
                                                                        <div data-field="mrtd" className="mrtd-value text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {/* {quote_report.mrTd?.slice(0, 10)}...{quote_report.mrTd?.slice(-8)} */}
                                                                            {tos.name === 'Morphic AI' ? `${quote_report.mrTd?.slice(0, 10)}...${quote_report.mrTd?.slice(-8)}` : `${quote_report.mrTd?.slice(11, 21)}...${quote_report.mrTd?.slice(22, 30)}`}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">RTMR0</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {/* {quote_report.rtMr0?.slice(0, 10)}...{quote_report.rtMr0?.slice(-8)} */}
                                                                            {tos.name === 'Morphic AI' ? `${quote_report.rtMr0?.slice(0, 10)}...${quote_report.rtMr0?.slice(-8)}` : `${quote_report.rtMr0?.slice(11, 21)}...${quote_report.rtMr0?.slice(22, 30)}`}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">RTMR1</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {/* {quote_report.rtMr1?.slice(0, 10)}...{quote_report.rtMr1?.slice(-8)} */}
                                                                            {tos.name === 'Morphic AI' ? `${quote_report.rtMr1?.slice(0, 10)}...${quote_report.rtMr1?.slice(-8)}` : `${quote_report.rtMr1?.slice(11, 21)}...${quote_report.rtMr1?.slice(22, 30)}`}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">RTMR2</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {/* {quote_report.rtMr2?.slice(0, 10)}...{quote_report.rtMr2?.slice(-8)} */}
                                                                            {tos.name === 'Morphic AI' ? `${quote_report.rtMr2?.slice(0, 10)}...${quote_report.rtMr2?.slice(-8)}` : `${quote_report.rtMr2?.slice(11, 21)}...${quote_report.rtMr2?.slice(22, 30)}`}
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
                                                    {vm && (
                                                        <>
                                                            <div>
                                                                <div className="text-[11px] text-gray-400">Code Hash</div>
                                                                <div data-field="code-hash" className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                    {/* {vm.code_hash?.slice(0, 10)}...{vm.code_hash?.slice(-8)} */}
                                                                    {tos.name === 'Morphic AI' ? `${vm.code_hash?.slice(0, 10)}...${vm.code_hash?.slice(-8)}` : `${vm.code_hash?.slice(11, 21)}...${vm.code_hash?.slice(22, 30)}`}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-[11px] text-gray-400">Certificate</div>
                                                                <div data-field="cert" className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                    {vm.cert?.slice(0, 8)}...{vm.cert?.slice(-8)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-[11px] text-gray-400">CA-Certificate</div>
                                                                <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                    {/* {vm.ca_cert_hash?.slice(0, 10)}...{vm.ca_cert_hash?.slice(-8)} */}
                                                                    {tos.name === 'Morphic AI' ? `${vm.ca_cert_hash?.slice(0, 10)}...${vm.ca_cert_hash?.slice(-8)}` : `${vm.ca_cert_hash?.slice(11, 21)}...${vm.ca_cert_hash?.slice(22, 30)}`}
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
                                                    {vm?.quote && (
                                                        <>
                                                            {/* Default visible fields */}
                                                            <div>
                                                                <div className="text-[11px] text-gray-400">TD info hash</div>
                                                                <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                    {/* {quote_report.mrTd.slice(0, 10)}...{quote_report.mrTd.slice(-8)} */}
                                                                    {tos.name === 'Morphic AI' ? `${quote_report.mrTd?.slice(0, 10)}...${quote_report.mrTd?.slice(-8)}` : `${quote_report.mrTd?.slice(11, 21)}...${quote_report.mrTd?.slice(22, 30)}`}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-[11px] text-gray-400">Report data</div>
                                                                <div data-field="report-data" className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs quote-report-data">
                                                                    {/* {quote_report.reportData?.slice(0, 10)}...{quote_report.reportData?.slice(-8)} */}
                                                                    {tos.name === 'Morphic AI' ? `${quote_report.reportData?.slice(0, 10)}...${quote_report.reportData?.slice(-8)}` : `${quote_report.reportData?.slice(11, 21)}...${quote_report.reportData?.slice(22, 30)}`}
                                                                </div>
                                                            </div>

                                                            {/* Expandable fields */}
                                                            {/* {expandedSections[operator.id]?.quote && (
                                                                <>
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">Type</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {vm.report.quote.type?.slice(0, 10)}...{vm.report.quote.type?.slice(-8)}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">Cpu svn</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {vm.report.quote.cpu_svn?.slice(0, 10)}...{vm.report.quote.cpu_svn?.slice(-8)}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">TCB hash</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {vm.report.quote.tcb_hash?.slice(0, 10)}...{vm.report.quote.tcb_hash?.slice(-8)}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[11px] text-gray-400">Signature</div>
                                                                        <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                            {vm.report.quote.signature?.slice(0, 10)}...{vm.report.quote.signature?.slice(-8)}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )} */}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
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
                                        <div data-field="verifiability" className="text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1 rounded text-xs">
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

                            {/* Amazon */}
                            <div data-type="amazon" className="bg-[#1E3448]/90 rounded-xl overflow-hidden shadow-lg">
                                <div className="h-10 bg-gradient-to-r from-yellow-500/30 to-yellow-300/30 flex items-center px-4">
                                    <Cpu className="w-5 h-5 text-morphic-primary mr-2" />
                                    <span className="text-base font-bold text-white">Amazon</span>
                                </div>
                                <div className="p-3">
                                    <div className="text-sm text-gray-400 mb-1">Product</div>
                                    <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                        Nitro
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
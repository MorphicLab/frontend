import React, { useEffect, useRef } from 'react';
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
    operators,
    vms,
    onClose
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tosHashRef = useRef<HTMLDivElement>(null);
    const operatorsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const operatorsContainer = operatorsRef.current;
        if (!container || !operatorsContainer) return;

        const updateConnections = () => {
            const tosHash = tosHashRef.current;
            if (!tosHash) return;

            // 清除现有的连线
            const existingLines = container.querySelectorAll('.connection-line');
            existingLines.forEach(line => line.remove());

            // 创建主SVG容器
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'connection-line');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.pointerEvents = 'none';
            svg.style.zIndex = '10';

            // 创建渐变定义
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.id = 'line-gradient';
            gradient.innerHTML = `
                <stop offset="0%" stop-color="#00D0EC" />
                <stop offset="100%" stop-color="#46DCE1" />
            `;
            defs.appendChild(gradient);
            svg.appendChild(defs);

            const tosRect = tosHash.getBoundingClientRect();
            const tosCenter = {
                x: tosRect.right,
                y: tosRect.top + tosRect.height / 2
            };

            // 为每个可见的operator创建连线
            const operatorMrtds = operatorsContainer.querySelectorAll('.mrtd-value');
            operatorMrtds.forEach((mrtd) => {
                const rect = mrtd.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // 检查是否在视图中
                if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
                    const targetCenter = {
                        x: rect.left,
                        y: rect.top + rect.height / 2
                    };

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const startX = tosCenter.x - containerRect.left;
                    const startY = tosCenter.y - containerRect.top;
                    const endX = targetCenter.x - containerRect.left;
                    const endY = targetCenter.y - containerRect.top;

                    // 使用平滑的S形曲线
                    const dx = endX - startX;
                    const curve = `
                        M ${startX} ${startY}
                        C ${startX + dx/3} ${startY},
                          ${endX - dx/3} ${endY},
                          ${endX} ${endY}
                    `;

                    path.setAttribute('d', curve);
                    path.setAttribute('stroke', 'url(#line-gradient)');
                    path.setAttribute('stroke-width', '2');
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke-dasharray', '4,4');
                    path.style.filter = 'drop-shadow(0 0 4px rgba(0, 208, 236, 0.5))';

                    // 添加动画
                    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                    animate.setAttribute('attributeName', 'stroke-dashoffset');
                    animate.setAttribute('from', '8');
                    animate.setAttribute('to', '0');
                    animate.setAttribute('dur', '1s');
                    animate.setAttribute('repeatCount', 'indefinite');
                    path.appendChild(animate);

                    svg.appendChild(path);
                }
            });

            container.appendChild(svg);
        };

        // 监听滚动事件
        const handleScroll = () => {
            requestAnimationFrame(updateConnections);
        };

        operatorsContainer.addEventListener('scroll', handleScroll);
        
        // 初始化连线 - 等待动画完成后
        setTimeout(updateConnections, 500); // 等待0.5秒让动画完成
        
        // 添加window resize事件监听
        window.addEventListener('resize', updateConnections);

        // 清理函数
        return () => {
            operatorsContainer.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateConnections);
            const lines = container.querySelectorAll('.connection-line');
            lines.forEach(line => line.remove());
        };
    }, [operators]);

    const layout = {
        containerClass: 'justify-center items-start',
        tosWidth: 'w-[280px]',
        operatorsWidth: 'w-[320px]',
        gap: 'gap-20'  // 增加间距
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
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
                    background: #2A4157;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #375672;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #2A4157 transparent;
                }
            `}</style>
            <motion.div
                ref={containerRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative ${operators.length <= 4 ? 'w-[80%]' : 'w-[90%]'} h-[85%] 
                           p-6 bg-[#1B2B3A] rounded-3xl overflow-hidden`}
                onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                <div className={`flex h-full ${layout.containerClass} ${layout.gap}`}>
                    {/* TOS Card */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`${layout.tosWidth} min-w-[200px]`}
                    >
                        <div className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                            <div className="h-10 bg-gradient-to-r from-morphic-accent/20 to-morphic-primary/20 flex items-center px-4">
                                <span className="text-lg font-bold text-white">{tos.name}</span>
                            </div>
                            <div className="p-4">
                                <div className="tos-hash" ref={tosHashRef}>
                                    <div className="text-sm text-gray-400 mb-1">Code Hash</div>
                                    <div className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                        {tos.codeHash?.slice(0, 10)}...{tos.codeHash?.slice(-8)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Operators */}
                    <div 
                        ref={operatorsRef}
                        className={`${layout.operatorsWidth} h-full overflow-y-auto custom-scrollbar`}
                    >
                        <div className="space-y-2 pr-2">
                            {operators.map((operator, index) => (
                                <motion.div
                                    key={operator.id}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#1E3448] rounded-lg overflow-hidden shadow-lg"
                                >
                                    <div className="h-9 bg-gradient-to-r from-morphic-accent/20 to-morphic-primary/20 flex items-center px-3">
                                        <span className="text-base font-bold text-white">{operator.name}</span>
                                    </div>
                                    <div className="p-2.5">
                                        <div className="operator-hash">
                                            <div className="text-xs text-gray-400 mb-1">TCB Info</div>
                                            <div className="space-y-1.5">
                                                {vms.find(vm => vm.operator === operator.id)?.vm_report.tcb && (
                                                    <>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">Rootfs Hash</div>
                                                            <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rootfs_hash?.slice(0, 10)}...{vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rootfs_hash?.slice(-8)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">MRTD</div>
                                                            <div className="mrtd-value text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.mrtd?.slice(0, 10)}...{vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.mrtd?.slice(-8)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">RTMR0</div>
                                                            <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr0?.slice(0, 10)}...{vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr0?.slice(-8)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">RTMR1</div>
                                                            <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr1?.slice(0, 10)}...{vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr1?.slice(-8)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">RTMR2</div>
                                                            <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr2?.slice(0, 10)}...{vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr2?.slice(-8)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] text-gray-400">RTMR3</div>
                                                            <div className="text-morphic-primary font-mono bg-morphic-primary/10 px-2 py-1 rounded text-xs">
                                                                {vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr3?.slice(0, 10)}...{vms.find(vm => vm.operator === operator.id)?.vm_report.tcb?.rtmr3?.slice(-8)}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
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
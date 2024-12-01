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

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 创建 SVG 元素
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none');
        svg.style.zIndex = '1';
        container.appendChild(svg);

        // 创建渐变
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.id = 'line-gradient';
        gradient.innerHTML = `
            <stop offset="0%" stop-color="#00D0EC" />
            <stop offset="100%" stop-color="#46DCE1" />
        `;
        defs.appendChild(gradient);
        svg.appendChild(defs);

        // 获取 TOS codeHash 元素
        const tosHash = container.querySelector('.tos-hash .hash-value');
        // 获取所有 Operator codeHash 元素
        const operatorHashes = container.querySelectorAll('.operator-hash .hash-value');

        if (!tosHash) return;

        const drawLines = () => {
            // 清除现有的线
            const existingPaths = svg.querySelectorAll('path');
            existingPaths.forEach(path => path.remove());

            const tosRect = tosHash.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            operatorHashes.forEach((opHash) => {
                const opRect = opHash.getBoundingClientRect();

                const startX = tosRect.right - containerRect.left;
                const startY = tosRect.top - containerRect.top + tosRect.height / 2;
                const endX = opRect.left - containerRect.left;
                const endY = opRect.top - containerRect.top + opRect.height / 2;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('stroke', 'url(#line-gradient)');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-dasharray', '4,4');
                path.style.filter = 'drop-shadow(0 0 4px rgba(0, 208, 236, 0.5))';

                // 创建平滑的 S 形曲线
                const dx = endX - startX;
                const curve = `
                    M ${startX} ${startY}
                    C ${startX + dx/3} ${startY},
                      ${endX - dx/3} ${endY},
                      ${endX} ${endY}
                `;

                path.setAttribute('d', curve);

                // 添加动画
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'stroke-dashoffset');
                animate.setAttribute('from', '8');
                animate.setAttribute('to', '0');
                animate.setAttribute('dur', '1s');
                animate.setAttribute('repeatCount', 'indefinite');
                path.appendChild(animate);

                svg.appendChild(path);
            });
        };

        drawLines();
        window.addEventListener('resize', drawLines);

        return () => {
            container.removeChild(svg);
            window.removeEventListener('resize', drawLines);
        };
    }, [operators]);

    // 根据 operators 数量计算布局
    const getOperatorLayout = (numOperators: number) => {
        if (numOperators <= 2) {
            return {
                gridCols: 1,
                tosWidth: 'w-1/5',  // 缩小 TOS 宽度
                operatorsWidth: 'w-1/3',  // 缩小 Operators 宽度
                containerClass: 'justify-center'  // 居中显示
            };
        } else if (numOperators <= 4) {
            return {
                gridCols: 2,
                tosWidth: 'w-1/5',
                operatorsWidth: 'w-2/5',
                containerClass: 'justify-center'
            };
        } else {
            return {
                gridCols: 3,
                tosWidth: 'w-1/5',
                operatorsWidth: 'w-1/2',
                containerClass: 'justify-start'
            };
        }
    };

    const layout = getOperatorLayout(operators.length);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                ref={containerRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative ${operators.length <= 4 ? 'w-[80%]' : 'w-[90%]'} 
                           ${operators.length <= 2 ? 'h-[70%]' : 'h-[85%]'} 
                           p-8 bg-[#1B2B3A] rounded-3xl overflow-hidden`}
                onClick={e => e.stopPropagation()}
            >
                <div className={`flex h-full ${layout.containerClass} gap-8`}>
                    {/* TOS Card */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`${layout.tosWidth}`}
                    >
                        <div className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg">
                            <div className="h-12 bg-gradient-to-r from-morphic-primary/20 to-morphic-accent/20 flex items-center px-4">
                                <span className="text-lg font-bold text-white">{tos.name}</span>
                            </div>
                            <div className="p-4 space-y-3">
                                <InfoItem icon={<Users className="h-4 w-4" />} label="Creator" value={tos.creator.name} />
                                <InfoItem icon={<Coins className="h-4 w-4" />} label="Restaked" value={`${tos.restaked} ETH`} />
                                <InfoItem icon={<Users className="h-4 w-4" />} label="Operators" value={`${tos.operators}`} />
                                <InfoItem icon={<Star className="h-4 w-4" />} label="Status" value={tos.status} />
                                <div className="tos-hash pt-1">
                                    <div className="text-sm text-gray-400 mb-1">Code Hash</div>
                                    <div className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                        {tos.codeHash?.slice(0, 10)}...{tos.codeHash?.slice(-8)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Operators */}
                    <div className={`${layout.operatorsWidth}`}>
                        <div className="space-y-3">
                            {operators.map((operator, index) => (
                                <motion.div
                                    key={operator.id}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#1E3448] rounded-xl overflow-hidden shadow-lg"
                                >
                                    <div className="h-12 bg-gradient-to-r from-morphic-accent/20 to-morphic-primary/20 flex items-center px-4">
                                        <span className="text-lg font-bold text-white">{operator.name}</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoItem icon={<MapPin className="h-4 w-4" />} label="Location" value={operator.location} />
                                            <InfoItem icon={<Cpu className="h-4 w-4" />} label="Type" value={operator.labels.join(', ')} />
                                            <InfoItem icon={<Coins className="h-4 w-4" />} label="Restaked" value={`${operator.restaked} ETH`} />
                                            <InfoItem icon={<Star className="h-4 w-4" />} label="Reputation" value={operator.reputation} />
                                        </div>
                                        <div className="operator-hash pt-1">
                                            <div className="text-sm text-gray-400 mb-1">Code Hash</div>
                                            <div className="hash-value text-morphic-primary font-mono bg-morphic-primary/10 px-3 py-1.5 rounded-lg text-sm">
                                                {vms.find(vm => vm.operator === operator.id)?.codeHash?.slice(0, 10)}...{vms.find(vm => vm.operator === operator.id)?.codeHash?.slice(-8)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
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
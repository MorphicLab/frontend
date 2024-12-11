import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { Vm, VmStatus } from '../../data/define';
import { useBlockchainStore } from '../store/chainStore';

interface ThinVmCardProps {
    vm: Vm;
    showOperator?: boolean;
}

const statusColors = {
    [VmStatus.Waiting]: 'bg-yellow-100 text-yellow-800',
    [VmStatus.Active]: 'bg-green-100 text-green-800',
};

const statusText = {
    [VmStatus.Waiting]: 'Waiting',
    [VmStatus.Active]: 'Active',
};

export const ThinVmCard: React.FC<ThinVmCardProps> = ({ vm, showOperator = true }) => {
    const operators = useBlockchainStore(state => state.operators);
    const operator = operators.find(op => op.id === vm.operator_id);

    return (
        <Link to={`/vm/${vm.id}`}>
            <motion.div className="bg-gray-800/50 rounded-lg px-4 py-3 hover:bg-gray-700/50 transition-colors border border-morphic-primary/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-white text-sm font-mono">
                            {vm.id.slice(0, 8)}...
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 bg-morphic-primary/20 text-morphic-primary text-xs rounded-full flex items-center`}>
                                <Cpu className="h-3 w-3 mr-1" />
                                {vm.type}
                            </span>
                        </div>
                        {showOperator && operator && (
                            <div className="text-gray-400 text-sm font-medium">
                                from {operator.name}
                            </div>
                        )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[vm.status]}`}>
                        {statusText[vm.status]}
                    </span>
                </div>
            </motion.div>
        </Link>
    );
};

export default ThinVmCard;

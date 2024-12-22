import { TOS, Operator } from "../data/define";


const getMorphicAiTos = (toss: TOS[]): TOS => {
    const morphicai_tos = toss.filter(tos => tos.name === 'Morphic AI')[0];
    return morphicai_tos;
}

const getMorphicAiOperators = (morphicai_tos: TOS, operators: Operator[]): Operator[] => {
    // Get Morphic AI operators and VMs
    const morphicai_operators = operators.filter(op => 
        morphicai_tos.vm_ids && 
        morphicai_tos.vm_ids[op.id] && 
        morphicai_tos.vm_ids[op.id].length > 0
    );
    return morphicai_operators;
}

const getMorphicAiVms = (morphicai_tos: TOS, vms: Vm[]): Vm[] => {
    // Get Morphic AI VMs
    const morphicai_vms = vms.filter(vm => vm.tos_id === morphicai_tos.id);
    return morphicai_vms;
}


export { getMorphicAiTos, getMorphicAiOperators, getMorphicAiVms }
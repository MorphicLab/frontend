import { TOS, Operator } from "../data/define";
import { MOCK_MORPHIC_AI_TOS } from "../data/mockData";

const getMorphicAiTos = (toss: TOS[]): TOS => {
    let morphicai_tos: TOS;
    if (!toss || toss.filter(tos => tos.name === 'Morphic AI').length === 0) {
        morphicai_tos = MOCK_MORPHIC_AI_TOS;
    } else {
        morphicai_tos = toss.filter(tos => tos.name === 'Morphic AI')[0];
    }
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
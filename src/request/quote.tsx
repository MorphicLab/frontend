import { Vm } from '../data/define';
import { parseQuoteToJson } from '../tool/quote';


// 根据用户获取agent列表的接口
export async function getQuoteList(operatorDomain: string, operatorPort: number): Promise<Vm[]> {
    try {
        let agentId = '';
        // TODO : get ip and port from agent
        const response = await fetch(`http://http://66.220.6.113:33010/agents`);
        // const response = await fetch(`http://${operatorDomain}:${operatorPort}/agents`);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        const jsonAgent = await response.json();
        const randomIndex = Math.floor(Math.random() * jsonAgent.agents.length);
        agentId = jsonAgent.agents[randomIndex].id;

        const responseQuote = await fetch(`http://66.220.6.113:33010/agents/07b6bf73-fe56-0327-ad9a-9be8fa688dc3/quote`);
        // const responseQuote = await fetch(`http://${operatorDomain}:${operatorPort}/agents/${agentId}/quote`);
        if (!responseQuote.ok) {
            const error = await responseQuote.text();
            throw new Error(error);
        }
        const jsonQuote = await responseQuote.json();
        const quoteString = parseQuoteToJson(jsonQuote.quote);
        console.log("quoteString:", quoteString);
        return [
            {
                pubkey: jsonQuote.pubkey,
                address: jsonQuote.address,
                event_log: jsonQuote.event_log,
                quote: quoteString,
                id: '',
                type: '',
                roots_hash: ''
            }
        ];
    } catch (error) {
        console.error('failed to get quote list:', error);
        return [];
    }
}

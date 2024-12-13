import { Vm } from '../data/define';
import { parseQuoteToJson } from '../tool/quote';


// 根据用户获取agent列表的接口
export async function getQuoteList(): Promise<Vm[]> {
    console.log("http getQuoteList");
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        const response = await fetch(`/agents/07b6bf73-fe56-0327-ad9a-9be8fa688dc3/quote`, {
            method: 'GET',
            headers
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        const data = await response.json();
        parseQuoteToJson(data.quote);
        return [
            {
                pubkey: data.pubkey,
                address: data.address,
                event_log: data.event_log,
            }
        ];

    } catch (error) {
        console.error('failed to get quote list:', error);
        return [];
    }
}

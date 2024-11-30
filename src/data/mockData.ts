import { 
    TOSStatus,
    TOS,
    Operator,
    Agent,
    tosLabels,
    operatorLabels,
    agentLabels
} from './define';

export type { TOSStatus, TOS, Operator, Agent };
export { tosLabels, operatorLabels, agentLabels };

// Mock 数据
export const MOCK_TOS: TOS[] = [
    {
        id: '0x86d50d5630B4cF539739dF2C5dAcb4c659F2488D',
        name: 'Morphic KMS',
        logo: '/images/kms-logo.ico',
        dao: '',
        website: '/morphic-kms',
        description: 'A decentralized key management service powered by trustless computation...',
        creator: {
            address: '0x86d50d5630B4cF539739dF2C5dAcb4c659F2488D',
            name: 'Morphic Labs',
            logo: '/images/morphic-logo-sm.png'
        },
        vcpus: 1,
        vmemory: 1,
        disk: 1,
        version: '1.0',
        code: '',
        labels: ['Compute'],
        restaked: 962,
        operators: 32,
        txHash: '0x4160db15ac2a8ccbc0b333df207ea997b32093b5d4c9ff35e66fe9c215f51f13',
        stakers: 1023,
        likes: 512,
        status: 'active',
        codeHash: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
    // ... 可以添加更多 TOS 数据
];

export const MOCK_MORPHIC_AI_TOS: TOS = {
    id: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    name: 'Morphic AI',
    logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop',
    dao: '',
    website: '/morphic-ai',
    description: 'A decentralized AI service platform powered by trustless computation...',
    creator: {
        address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        name: 'Morphic Labs',
        logo: '/images/morphic-logo-sm.png'
    },
    vcpus: 1,
    vmemory: 1,
    disk: 10,
    version: '1.0',
    code: '',
    labels: ['DeAI', 'Compute'],
    restaked: 62,
    operators: 2,
    txHash: '0x4160db15ac2a8ccbc0b333df207ea997b32093b5d4c9ff35e66fe9c215f51f13',
    stakers: 89,
    likes: 142,
    status: 'waiting',
    codeHash: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
}

export const MOCK_OPERATORS: Operator[] = [
    {
        id: 1,
        name: "Morphic Operator",
        logo: "/images/morphic-logo-sm.png",
        labels: ["TDX", "H100"],
        address: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488D",
        owner: {
            name: "Morphic",
            logo: "/images/morphic-logo-sm.png"
        },
        location: "US West",
        restaked: "132",
        numStakers: "1.0k",
        numTosServing: 1,
        reputation: "High",
        description: "Leading TDX operator",
        codeHash: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    {
        id: 2,
        name: "Secure Node",
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABR1BMVEX///9ChvX6vAXqQjU0qFP//v////38/////v2p1LMmpUs5gPStxvmevfiZzqM3gfM6la8zqUr6vQRAh/T///n9uQDpQzfpNyfoRDP7uQD8tQAupVgxqlDuQTXnQzXsQjPpOzb++OdCqUr0oqL98u3mKxone/T7xAD72tf0xcL5urb3ra3xpJ/zvrb83dnxj4btXFLnKBTvdWruMiX0sq34z8jqJhvqTj389PXsa1/pJgbuf3bvZlvTP0JomuvTTFBbkvmEq/YpePbW4vrnPCDumJC2zvX/6uzs9vr85t3MOkFBiO76ztHuVy3tbyTwgCXziiDg6vrM4fz3og76uz//4J/97sj70mL+1oLzkxP3sbnscAj7x0H868n54I/31G76zlX4xzGJq/z86rZesFd3vouZx9BwnPllvX4EoTnL6NPf7+O53cMEyWVhAAAL1klEQVR4nO2c+1vTWBrHk5ZzGUKNJmnTRNtQtUEZFMpFEG+0OLWzjo66U3B2HeoM67CO/v8/7/umFQRykl44bZ09n8cKD1bab9/zXs9JNE2hUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBT/nxCiUQpfOYWvhE367Vw8nIIuEn1LCGF8wm/n4qEo7ivDMZBJJvZupMBu3rq9+P2NpRs3ltbv3L619e0vU0ZwWYLZQMrdxeWVp7XqmvuFtWrt6cry4t3uEwnl/BsU7BBOMJ48W191q64bZM8wn3XXau7q+rOuxm9wxRLuaNrN9ZXttaAUlArF0hmFBXyUA3d7ZX0Lnv5tRp6N1XtuKSgUsqUy6CuXz4gMskF5Hv5ya6sb7BtapUyjnGG+W9xcO7c0BQS1zTsQbjUGqXLS7z8dyAEMnGqx7AbFPgVmS4XsWnkRU8q34I4OvsuNzaf92g8pBsWgVN3c6EbeaYczdnO1lj0bWJJXKfhqsRRUV29O+t2ngRUn1dar7iDyvsKtrmMeneK4yiHAbN1fG8h+X1PIVu9vadNcszpE23BhzQ2rMFsKAndjmn2Rakvb5VKxPLTCbCEobn8/aRkCCINs9qA2SAiNpVyqPuB8GmscCqn+oVsYwX5digX30WM2jXUq0ciKCwXoqAoD94lp7ExltOGbQWGEIPMF94lt68bOlNkQMhhlK8NmwRNK2SJY0DZ0wwYrOlOkEhvdh25pZB+EbPHItHVdt3X78VQFGwJR1C30XWiLCZ7oPYFGWKdT1GdQtlTt9rSj4T4ydSMSiL44NyUKIbBT7da91Hdfjh5BsZANAkia5wwOP3WfGLap9zD1xi6OICetT8MpL906P4Y5R7dYLRQCNHYhzt7Bo2iJ9oBvzRafhmADiZ7dd0upTljGONKdtAWRFc/Z8IlpmrZ9YkPdfDwVLT+0E+vV4nyaEwbuWvXpwwc/3Fha+uHBiltbO2t29EGIo/aJDW07bE5HbfOsliitUIBCrJpdvvOs93xsHZ7dXi5VIfwGPfud9sFjwtYUpAyqrSan+lKwVlu+Bc88maeRKIDcXQaNkcQgi3nQts8p1B9PwTJlP9WSV6jrLm0xKAqoc/x/KCFRlORL3bWKPhinz9bD3QlK+8JmYhwNassct2XQFsc+RXEkB3GSaHx5O+j54HmBoNB4PlkjEmgKFwWZIsoOperKjzgFTeDZypr7RI8xYM8Tm7jhODEwDICMeZEHFqvLsIyTkxrTlv8BthJK1FM+IbkQR7tTLYgnv7U7oMAhie8Q/rEZms+FAs2mM0mF7KwXzh9TKmW3b4GF4DmJER8jzutQvEz155NM+5T+VA2w0MxCzgNVwYuXP79Cfn75AsT+iLGln7dHQWJsqIk88Y2T/htkQbTVUoApHdS9ePVPf2HB6pKxFhb8X9p7+CQnvXpmzm5oizQak8yJ7GYtO4/yXv6aQXGZDD4yVvTFWvDy+f1DyPOpNqCMvoGFGrtSoXZrjUOLgHU3KMwXX2XAeBkvUtY1YaarFR6+97aS+mso5VouFK1TY25CpRtuMq0E8y9+XehKEuBZ/n6FQchnyTGV78Trs017h6ZEKzlwRrSb94op+lBixvM7FfhAWGJe5K/D+FWq242WNompFKeE/evfIM9LVpi34Alevs1YcuYmTs6I90NIiXQSWxlQsTm/eB56nZek0Op6qP+ukpw4wMSxfmjqtrHTGvcqpVA2U+235NV5zph7TKNiXwQzzUHtFmtHaDEgFo1zpRIHquEDPz+IQMvzD7SE3U8Knh3GBxswZGOOjnVCzDlj+35KhDknMeN3NLFCKNBpXVSAQ6NY5+l59eKAtfbeS4kwMQoz/nvxuRmMzbsChfjT8I9xnQxzOBbL7/3B5PVEgkSe0O5xW1idokQoDMYxXqT4YXeGEgi50dtnPCGm1hN6DN2oUzKek7eEHfiZAZdoz4bgixBuxJEfOkWhQNPEOf8YqnBK2Z6XGVIhPPxDsRl4yxQqxCa58WYc81PCKsOI6ym08pmK2AwOj0+HJzJbGAWkq3w3UB48LdHzKiQh6tOjRIm2eYSfg+SVytqDpomvBfrQSiWkNaeerFA3mvLzfsVPaybE4BIlCQcQqRZffZ9INEziaBI1codpHW/YKIM+mNxBaVpOHEu7QMqQmRNZZMLEViJBopepkORoz9MV6o3XMndNIYrtd4cwwwjMV7SU/qAfhWZdpidSVoFyNDnSeEDcz6M0keJDOK0RZ8TeMm20JFbgXHsrLNcstBLo3z9oH+xDVshYJ7aGD8VL90E8E7Cbq++E8ds0x0bMSc0W4n7eyuS93w97czVWab/zveO8GQkkrI+pIua6VvMoNIX1KciXqA/qNeEKzXsZaOIJwd3PqH3YO3lqah7s4RBOoWqlfHdHmDVM23gjUeG+2IZeJzqBiVU1ltaQ9ljny5PBgriLkzprodQhjDp4ljon7Pdt4w95CjXxEvUOY2aah94XHxw8SzeFEmGZUiIp2uwJLOiBQGjSz0UA1vZ7Pjh4DqPNhmB+qhu7jqys3xZEUsvrMB5z6pVqb73IB+ngOcwR5UY8D6bJ6i/eCQJNfoFhjDi3crjGukt0iIthCOU7cRIN6DAeSylNKSMsKr1i8PfiZ2gQefa8lEmwCMgtu6KAanMZEh1GsKCJNeLvgr12sAOrDHltIeWUHgkKnLAlY5oBsWLPj69JIczEf6Z45SQbct+IM05F8bTxWoZCQrVDQV+BCzH2FSkYAq/hHu71GGWC/X05OR/eZztOH5SglrQRX2yswfMZMl6Mc4HCTH5fxutFCIYa5pyMF8O9mFiFlncg4/Wi1xQMNcwcl7Hbhuk71guttxJerUsuvseABkpOpIlVCNH1LRhYjivm4rdqDCktImS1eD+0MuiHUqooWhfYUIofQoEiiDQZC4pIOX23OJZK8ENK2aGotYD+XYpCJtioCZsyIg1nUYcfW9O0JZyQxIzfNOP9MJRS02jdWelAdekoYC1/FHO4PVLYkjMzpVpGcLLE35NwvSClu6JDmbYUE0IwYe/zgoG3JeElqSY4B6abdU3WXnA7PtJAC9xhRFB9DwPDW79QQUFj29Djy5p7/ybYd7I8v80uUCHFpkTQOhm2YexKm2JwQaSBn/ptjV/Y/Isy7jTFU2GDS6owcF4qcMMFiDadi7vHDJgw14g/UAteiBtssk4skL2Eg1B567B7dyjx1IkDDuMs+iYGvP9X9I9vngtn3oYdypx5M7FAiLLefz5/6uO3iE9+oUrqtJo7DfG+hW2bEs8pQnuRcErBuj4z+3Hmw6Vk/swlU39u4KWH4pNDUveeqFYR71uAQODabDIfLxtmIjr8sXXxKtUbMg+2Q4/YycTt42ODcf3qtZl0rlxO3eUVY+DAuy5RILQspBIXazCJXL/ah74RFYJAM3wt8zwNdFCsEzcztcCCM/JtiFed1GnCubiRIXhZQGw4xSXaj8ARbQheyoacvw7AoX862vTvgxewSqH3lSwPz9S8O6UQfNDq0wdHVmjqR+M4fUmcYX1wdBsaydfdXJRCaDFO++BMnz44ssLG7riuzz/w89YQPjiiQjucu8AOLRnW6WbFAfLgBSiMznmP6doZyva/8sH+l+hICsM6Higakw3BGbqdojWQD46kEC8p4eO8WR0uVCi2B1I3vMLolkNjvwax7UMUHcyAwyq09XDOoeO+Lp+xveuzY1Ioc/YkBqIa++/sWFZp+BivluayTnol8nl2tmdFKTWN3TXgGGpREUTjlz7KzRZGIzfJm33idWjOB7CjJIW22ai3EiZX4wDjm3PpSv8iB1BohkauhRcDTsMdW//6MPNxdvZaH8v1ymXBpb6nbGcYZqjXJ3lDjDNgIP/03YerKXO27qwtNNKx63O7zjivik2D9MoN59Nfn79L4c+5FJpvXrfwoDiVefXPoFDGosPrfd2pJeUqSY63lMbD8ETKqSCFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFArF35//AdqXQLJs52kyAAAAAElFTkSuQmCC",
        labels: ["SGX"],
        address: "0x9c340d5820B4cF539739dF2C5dAcb4c659F2488E",
        owner: {
            name: "Google",
            logo: "data:image/png;base64,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"
        },
        location: "EU Central",
        restaked: "98",
        numStakers: "800",
        numTosServing: 2,
        reputation: "High",
        description: "Specialized in SGX computing",
        codeHash: "0x8b230d5820B4cF539739dF2C5dAcb4c659F2488E"
    }
];

export const MOCK_AGENTS: Agent[] = [
    {
        id: 1,
        name: "ChatBot Agent",
        logo: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop",
        labels: ["Chat"],
        description: "An intelligent chatbot powered by advanced AI models",
        users: "2.5k",
        rating: 4.8,
        status: 'online',
        capabilities: ['Text Generation', 'Image Understanding', 'Voice Processing'],
        numOperators: 2,
        modelType: 'GPT-4'
      },
      {
        id: 2,
        name: "Code Assistant",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztncnxOUnTY_sw5t0_sFSYVJyXYXuPD6Ztg&s",
        labels: ["Chat", "Code"],
        description: "AI-powered coding assistant for developers",
        users: "1.8k",
        rating: 4.6,
        status: 'offline',
        capabilities: ['Code Generation', 'Code Review', 'Debugging'],
        modelType: 'GPT-3',
        numOperators: 2,
      },
      {
        id: 3,
        name: "Image Generator",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rhk82CINydd8t9ASEi1twWHCUXVddaOSPw&s",
        labels: ["Chat", "Image"],
        description: "Advanced AI image generation and editing",
        users: "3.1k",
        rating: 4.9,
        status: 'online',
        capabilities: ['Image Generation', 'Image Editing', 'Image Understanding'],
        modelType: 'Stable Diffusion',
        numOperators: 2,
      }
    // ... 可以添加更多 Agent 数据
]; 
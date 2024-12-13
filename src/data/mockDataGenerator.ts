import { Operator, TOS, Vm, VmStatus } from './define';
import { mockQuote } from '../tool/quote';

// Function to generate mock operators
function generateMockOperators(count: number): Operator[] {
    const providers = [
        {
            name: 'GCP',
            logo: 'data:image/png;base64,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',
            locations: ['us-west1', 'us-east1', 'europe-west1', 'asia-east1'],
            domain: 'google.com',
            vmTypes: ['TDX', 'SEV']
        },
        {
            name: 'AWS',
            logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW9dZ4v-ccWk26XQvbW5WeXD5CsyG5y9Czsw&s',
            locations: ['us-west-2', 'us-east-2', 'eu-west-1', 'ap-southeast-1'],
            domain: 'amazon.com',
            vmTypes: ['Nitro']
        },
        {
            name: 'Azure',
            logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk2XBywdtgLSwKzI3MEW15PzC4jB9djXQ_4g&s',
            locations: ['eastus', 'westus', 'northeurope', 'southeastasia'],
            domain: 'microsoft.com',
            vmTypes: ['TDX']
        },
        {
            name: 'Morphic Lab',
            logo: '/images/morphic-logo-sm.png',
            locations: ['global'],
            domain: 'morphic.network',
            vmTypes: ['TDX', 'SEV', 'Nitro']
        }
    ];

    const operators: Operator[] = [];
    for (let i = 0; i < count; i++) {
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const location = provider.locations[Math.floor(Math.random() * provider.locations.length)];
        const vmTypes = provider.vmTypes;
        const reputation = Math.floor(Math.random() * 10) + 90; // 90-99
        const num_stakers = Math.floor(Math.random() * 200) + 50; // 50-249
        const address = `0x${Math.random().toString(16).slice(2)}B4cF539739dF2C5dAcb4c659F2488E2c340d5820`.slice(0, 42);
        const port = Math.floor(Math.random() * 65535) + 1;

        operators.push({
            id: address,
            name: `${provider.name} Op ${i + 1}`,
            logo: provider.logo,
            labels: vmTypes,
            owner: {
                name: provider.name + ' Op ' + (i + 1),
                logo: provider.logo,
                address: address
            },
            location: location,
            domain: provider.domain,
            port: port,
            vm_ids: {},
            description: 'Specialized in ' + vmTypes.join(', ') + ' computing',
            num_stakers: num_stakers,
            reputation: reputation
        });
    }
    return operators;
}

// Helper function to generate random hex string of specified length
function generateRandomHex(length: number): string {
    return Array.from(
        { length },
        () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

// Helper function to generate random bytes20 hex string (40 characters)
function generateBytes20Id(): string {
    const chars = '0123456789abcdef';
    return '0x' + Array.from(
        { length: 40 }, 
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
}

// Helper function to generate random certificate in PEM format
function generateRandomCertificate(): string {
    const generateBase64 = (length: number) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        return Array.from(
            { length },
            () => chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    };

    const lines = [
        '-----BEGIN CERTIFICATE-----',
        ...Array.from({ length: 20 }, () => generateBase64(64)),
        '-----END CERTIFICATE-----'
    ];

    return lines.join('\n');
}

// // Helper function to generate VM report data
// function generateVmReportData() {
//     return {
//         tee_type: '129', // 129 for TDX, 128 for SGX
//         pce_svn: generateRandomHex(6),
//         tcb_info_hash: generateRandomHex(64),
//         td_info_hash: generateRandomHex(64),
//         report_data: generateRandomHex(64),
//         mac: generateRandomHex(32),
//     };
// }

// Function to generate VMs for all TOSs
function generateVmsForToss(toss: TOS[], operators: Operator[]): { vms: Vm[] } {
    const vms: Vm[] = [];

    toss.forEach(tos => {
        const selectedOperators = operators
            .filter(op => tos.vm_types.some(type => op.labels.includes(type)))
            .slice(0, Math.max(tos.operator_minimum, Math.floor(Math.random() * 5) + tos.operator_minimum));

        const code_hash = generateRandomHex(64);
        selectedOperators.forEach(op => {
            const numVms = Math.floor(Math.random() * 2) + 1; // 1-2 VMs per operator

            for (let i = 0; i < numVms; i++) {
                const vmType = tos.vm_types[Math.floor(Math.random() * tos.vm_types.length)];
                const vmId = generateBytes20Id();

                vms.push({
                    id: vmId,
                    type: vmType,
                    operator_id: op.id,
                    tos_id: tos.id,
                    quote: mockQuote,
                    code_hash: code_hash,
                    cert: generateRandomCertificate(),
                    status: VmStatus.Active,
                    roots_hash: generateRandomHex(64),
                    ca_cert_hash: generateRandomHex(64),
                    pubkey: generateRandomHex(64),
                    address: generateRandomHex(42),
                    event_log: generateRandomHex(64)
                });
            }
        });
    });

    return { vms };
}

// Export functions for use in mockData.ts
export { generateMockOperators, generateVmsForToss, generateRandomHex };

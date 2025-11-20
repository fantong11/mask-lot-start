// Mock Data for Products (Shipped Lots/Models)
export interface Layer {
    name: string;
    maskId: string;
    revision: string;
    status: 'Active' | 'Inactive';
}

export interface Product {
    id: string;
    name: string;
    tech: string;
    layers: Layer[];
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'N3_LOGIC_A',
        name: 'N3 Logic High Performance',
        tech: '3nm',
        layers: [
            { name: 'M1', maskId: 'N3-M1-001', revision: 'A', status: 'Active' },
            { name: 'M2', maskId: 'N3-M2-001', revision: 'A', status: 'Active' },
            { name: 'M3', maskId: 'N3-M3-001', revision: 'B', status: 'Active' },
            { name: 'POLY', maskId: 'N3-PO-001', revision: 'A', status: 'Active' },
            { name: 'OD', maskId: 'N3-OD-001', revision: 'C', status: 'Inactive' },
            { name: 'VIA1', maskId: 'N3-V1-001', revision: 'A', status: 'Active' },
            { name: 'VIA2', maskId: 'N3-V2-001', revision: 'A', status: 'Active' }
        ]
    },
    {
        id: 'N5_HPC_B',
        name: 'N5 HPC Standard',
        tech: '5nm',
        layers: [
            { name: 'M1', maskId: 'N5-M1-002', revision: 'A', status: 'Active' },
            { name: 'M2', maskId: 'N5-M2-002', revision: 'A', status: 'Active' },
            { name: 'POLY', maskId: 'N5-PO-002', revision: 'B', status: 'Active' },
            { name: 'OD', maskId: 'N5-OD-002', revision: 'A', status: 'Active' },
            { name: 'VIA1', maskId: 'N5-V1-002', revision: 'A', status: 'Active' }
        ]
    },
    {
        id: 'N7_AUTO_C',
        name: 'N7 Automotive Grade',
        tech: '7nm',
        layers: [
            { name: 'M1', maskId: 'N7-M1-003', revision: 'A', status: 'Active' },
            { name: 'POLY', maskId: 'N7-PO-003', revision: 'A', status: 'Active' },
            { name: 'OD', maskId: 'N7-OD-003', revision: 'A', status: 'Active' },
            { name: 'VIA1', maskId: 'N7-V1-003', revision: 'A', status: 'Active' }
        ]
    },
    {
        id: 'N28_IOT_D',
        name: 'N28 IoT Low Power',
        tech: '28nm',
        layers: [
            { name: 'M1', maskId: 'N28-M1-004', revision: 'A', status: 'Active' },
            { name: 'POLY', maskId: 'N28-PO-004', revision: 'A', status: 'Active' },
            { name: 'OD', maskId: 'N28-OD-004', revision: 'A', status: 'Active' }
        ]
    },
];

export const MOCK_FAB_CODES: string[] = Array.from({ length: 20 }, (_, i) => `FAB_${i + 1}`);
// Generate 20,000 Cost Centers
export const MOCK_COST_CENTERS: string[] = Array.from({ length: 20000 }, (_, i) => `CC_${10000 + i}`);

export const MOCK_FABS: string[] = ['Fab 12', 'Fab 14', 'Fab 15', 'Fab 18'];
export const MOCK_REASONS: string[] = ['Incoming Check', 'Periodic Clean', 'Repair', 'Engineering Test'];
export const MOCK_PRIORITIES: string[] = ['Low', 'Normal', 'Urgent'];

export interface SearchFilters {
    fabCode?: string;
    costCenter?: string;
}

export interface LotRequest {
    productId: string;
    productName: string;
    layer: string;
    fab: string;
    reason: string;
    priority: string;
    note?: string;
}

export interface Lot extends LotRequest {
    id: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
}

export interface FormOptions {
    fabs: string[];
    reasons: string[];
    priorities: string[];
}

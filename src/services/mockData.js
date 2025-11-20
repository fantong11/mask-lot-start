// Mock Data for Products (Shipped Lots/Models)
export const MOCK_PRODUCTS = [
    {
        id: 'N3_LOGIC_A',
        name: 'N3 Logic High Performance',
        tech: '3nm',
        layers: ['M1', 'M2', 'M3', 'POLY', 'OD', 'VIA1', 'VIA2']
    },
    {
        id: 'N5_HPC_B',
        name: 'N5 HPC Standard',
        tech: '5nm',
        layers: ['M1', 'M2', 'POLY', 'OD', 'VIA1']
    },
    {
        id: 'N7_AUTO_C',
        name: 'N7 Automotive Grade',
        tech: '7nm',
        layers: ['M1', 'POLY', 'OD', 'VIA1']
    },
    {
        id: 'N28_IOT_D',
        name: 'N28 IoT Low Power',
        tech: '28nm',
        layers: ['M1', 'POLY', 'OD']
    },
];

export const MOCK_FAB_CODES = Array.from({ length: 20 }, (_, i) => `FAB_${i + 1}`);
// Generate 20,000 Cost Centers
export const MOCK_COST_CENTERS = Array.from({ length: 20000 }, (_, i) => `CC_${10000 + i}`);

export const MOCK_FABS = ['Fab 12', 'Fab 14', 'Fab 15', 'Fab 18'];
export const MOCK_REASONS = ['Incoming Check', 'Periodic Clean', 'Repair', 'Engineering Test'];
export const MOCK_PRIORITIES = ['Low', 'Normal', 'Urgent'];

const LOTS_STORAGE_KEY = 'mask_lot_requests';

const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const MaskService = {
    // Search Products instead of Masks
    searchProducts: async (query, filters = {}) => {
        await simulateDelay(2000); // Reduced delay for better UX during testing, originally 10s

        // If no query and no filters, return empty to avoid load
        if (!query && !filters.fabCode && !filters.costCenter) return [];

        let results = MOCK_PRODUCTS;

        // 1. Filter by Query (ID or Name)
        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(p =>
                p.id.toLowerCase().includes(lowerQuery) ||
                p.name.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Filter by Fab Code (Simulated)
        if (filters.fabCode) {
            // In a real app, we would filter by fabCode. 
            // For mock, we just pass through if selected to simulate "filtering"
        }

        return results;
    },

    getFabCodes: async () => {
        await simulateDelay(1000);
        return MOCK_FAB_CODES;
    },

    getCostCenters: async () => {
        await simulateDelay(1500);
        return MOCK_COST_CENTERS;
    },

    getProductById: (id) => {
        return MOCK_PRODUCTS.find(p => p.id === id);
    }
};

export const LotService = {
    getLots: () => {
        const data = localStorage.getItem(LOTS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    createLot: (lotData) => {
        const lots = LotService.getLots();
        // Generate a new Lot ID (e.g., L + Timestamp + Random)
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const newLotId = `L${timestamp}${random}`;

        const newLot = {
            ...lotData,
            id: newLotId,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };
        lots.unshift(newLot);
        localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(lots));
        return newLot;
    },

    updateStatus: async (lotId, status) => {
        await simulateDelay(1000);
        const lots = LotService.getLots();
        const updatedLots = lots.map(lot =>
            lot.id === lotId ? { ...lot, status } : lot
        );
        localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(updatedLots));
    },

    getFormOptions: async () => {
        await simulateDelay(1000);
        return {
            fabs: MOCK_FABS,
            reasons: MOCK_REASONS,
            priorities: MOCK_PRIORITIES
        };
    }
};

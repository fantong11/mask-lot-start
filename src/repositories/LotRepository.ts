import { Lot, MOCK_FABS, MOCK_REASONS, MOCK_PRIORITIES, FormOptions } from '../services/mockData';

const LOTS_STORAGE_KEY = 'mask_lot_requests';
const simulateDelay = (ms: number = 1000): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const LotRepository = {
    getAll: async (): Promise<Lot[]> => {
        await simulateDelay(500);
        const data = localStorage.getItem(LOTS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    save: async (lot: Lot): Promise<void> => {
        await simulateDelay(500);
        const lots = await LotRepository.getAll();
        lots.unshift(lot);
        localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(lots));
    },

    update: async (updatedLot: Lot): Promise<void> => {
        await simulateDelay(500);
        const lots = await LotRepository.getAll();
        const index = lots.findIndex(l => l.id === updatedLot.id);
        if (index !== -1) {
            lots[index] = updatedLot;
            localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(lots));
        }
    },

    // These are static options, could be in a separate MetadataRepository but fitting here for now
    getFormOptions: async (): Promise<FormOptions> => {
        await simulateDelay(500);
        return {
            fabs: MOCK_FABS,
            reasons: MOCK_REASONS,
            priorities: MOCK_PRIORITIES
        };
    }
};

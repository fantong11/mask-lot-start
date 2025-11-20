import { MOCK_PRODUCTS, MOCK_FAB_CODES, MOCK_COST_CENTERS, Product } from '../services/mockData';

const simulateDelay = (ms: number = 1000): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const ProductRepository = {
    getAll: async (): Promise<Product[]> => {
        // In a real app, this might fetch from an API
        // For now, we just return the mock data, maybe with a delay if we want to simulate network at this level
        // But usually repositories just return data. The Service handles the "business" delay if needed, 
        // or the repository handles the "network" delay. 
        // Let's keep the delay here to simulate the DB/Network call.
        await simulateDelay(500);
        return MOCK_PRODUCTS;
    },

    getById: async (id: string): Promise<Product | undefined> => {
        await simulateDelay(200);
        return MOCK_PRODUCTS.find(p => p.id === id);
    },

    getFabCodes: async (): Promise<string[]> => {
        await simulateDelay(500);
        return MOCK_FAB_CODES;
    },

    getCostCenters: async (): Promise<string[]> => {
        await simulateDelay(500);
        return MOCK_COST_CENTERS;
    }
};

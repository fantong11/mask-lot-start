import { ProductRepository } from '../repositories/ProductRepository';
import { Product, SearchFilters } from './mockData';

export const ProductService = {
    searchProducts: async (query: string, filters: SearchFilters = {}): Promise<Product[]> => {
        // If no query and no filters, return empty to avoid load
        if (!query && !filters.fabCode && !filters.costCenter) return [];

        const allProducts = await ProductRepository.getAll();
        let results = allProducts;

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
            // In a real app, the repository might handle this, or we filter in memory
        }

        return results;
    },

    getFabCodes: async (): Promise<string[]> => {
        return ProductRepository.getFabCodes();
    },

    getCostCenters: async (): Promise<string[]> => {
        return ProductRepository.getCostCenters();
    },

    getProductById: async (id: string): Promise<Product | undefined> => {
        return ProductRepository.getById(id);
    }
};

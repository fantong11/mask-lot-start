import { useState, useEffect } from 'react';
import { ProductService } from '../services/ProductService';
import { Product } from '../services/mockData';

export const useProductSearch = () => {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fabCodes, setFabCodes] = useState<string[]>([]);
    const [costCenters, setCostCenters] = useState<string[]>([]);
    const [filtersLoading, setFiltersLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchFilters = async () => {
            setFiltersLoading(true);
            try {
                const [fabs, ccs] = await Promise.all([
                    ProductService.getFabCodes(),
                    ProductService.getCostCenters()
                ]);
                setFabCodes(fabs);
                setCostCenters(ccs);
            } catch (error) {
                console.error("Failed to load filters", error);
            } finally {
                setFiltersLoading(false);
            }
        };
        fetchFilters();
    }, []);

    const search = async (query: string, fabCode?: string, costCenter?: string) => {
        setLoading(true);
        try {
            const results = await ProductService.searchProducts(query, {
                fabCode: fabCode || undefined,
                costCenter: costCenter || undefined
            });
            setData(results);
        } catch (error) {
            console.error("Search failed", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        fabCodes,
        costCenters,
        filtersLoading,
        search
    };
};

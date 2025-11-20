import { useState, useEffect, useCallback } from 'react';
import { LotService } from '../services/LotService';
import { Lot } from '../services/mockData';
import dayjs, { Dayjs } from 'dayjs';

export const useLotHistory = () => {
    const [allData, setAllData] = useState<Lot[]>([]);
    const [filteredData, setFilteredData] = useState<Lot[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const lots = await LotService.getLots();
            // Simulate network delay handled in Service/Repo or here
            // Service/Repo already has delay, so we just set data
            setAllData(lots);
            setFilteredData(lots); // Default to showing all
        } catch (error) {
            console.error("Failed to load lots", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filterByDate = useCallback((range: [Dayjs | null, Dayjs | null] | null) => {
        if (!range || !range[0] || !range[1]) {
            setFilteredData(allData);
            return;
        }

        const [start, end] = range;
        const filtered = allData.filter(item => {
            const itemDate = dayjs(item.createdAt);
            return itemDate.isAfter(start.startOf('day')) && itemDate.isBefore(end.endOf('day'));
        });
        setFilteredData(filtered);
    }, [allData]);

    const filterByStatus = useCallback((status: Lot['status']) => {
        const filtered = allData.filter(item => item.status === status);
        setFilteredData(filtered);
    }, [allData]);

    return {
        allData,
        filteredData,
        loading,
        loadData,
        filterByDate,
        filterByStatus
    };
};

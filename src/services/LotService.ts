import { LotRepository } from '../repositories/LotRepository';
import { Lot, LotRequest, FormOptions } from './mockData';

export const LotService = {
    getLots: async (): Promise<Lot[]> => {
        return LotRepository.getAll();
    },

    createLot: async (lotData: LotRequest): Promise<Lot> => {
        // Generate a new Lot ID (e.g., L + Timestamp + Random)
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const newLotId = `L${timestamp}${random}`;

        const newLot: Lot = {
            ...lotData,
            id: newLotId,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };

        await LotRepository.save(newLot);
        return newLot;
    },

    updateStatus: async (lotId: string, status: Lot['status']): Promise<void> => {
        const lots = await LotRepository.getAll();
        const lot = lots.find(l => l.id === lotId);
        if (lot) {
            const updatedLot = { ...lot, status };
            await LotRepository.update(updatedLot);
        }
    },

    getFormOptions: async (): Promise<FormOptions> => {
        return LotRepository.getFormOptions();
    }
};

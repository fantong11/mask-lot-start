import { useState } from 'react';
import { LotService } from '../services/LotService';
import { Lot } from '../services/mockData';
import { message } from 'antd';

export const useLotAction = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const updateStatus = async (lotId: string, status: Lot['status'], onSuccess?: () => void) => {
        setLoading(true);
        try {
            await LotService.updateStatus(lotId, status);
            message.success(`Lot ${lotId} ${status === 'Approved' ? 'Approved' : 'Rejected'}`);
            if (onSuccess) onSuccess();
        } catch (error) {
            message.error("Failed to update status");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        updateStatus
    };
};

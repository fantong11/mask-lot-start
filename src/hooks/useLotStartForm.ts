import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, message } from 'antd';
import { ProductService } from '../services/ProductService';
import { LotService } from '../services/LotService';
import { Product, FormOptions } from '../services/mockData';

export const useLotStartForm = (productId: string | undefined) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();

    const fabCode = searchParams.get('fabCode');
    const costCenter = searchParams.get('costCenter');

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
    const [options, setOptions] = useState<FormOptions>({ fabs: [], reasons: [], priorities: [] });
    const [optionsLoading, setOptionsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            setOptionsLoading(true);
            try {
                const [prod, opts] = await Promise.all([
                    ProductService.getProductById(productId),
                    LotService.getFormOptions()
                ]);

                if (prod) {
                    setProduct(prod);
                } else {
                    message.error('Product not found');
                    navigate('/');
                }
                setOptions(opts);
            } catch (error) {
                console.error("Failed to fetch data", error);
                message.error("Failed to load form data");
            } finally {
                setOptionsLoading(false);
            }
        };
        fetchData();
    }, [productId, navigate]);

    const handleLayerChange = (layers: string[]) => {
        setSelectedLayers(layers);
    };

    const submitBatch = async (values: any) => {
        if (selectedLayers.length === 0) {
            message.error('Please select at least one layer');
            return;
        }

        if (!product) return;

        setLoading(true);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const createdIds: string[] = [];

            // Use Promise.all to wait for all creations
            await Promise.all(selectedLayers.map(async layer => {
                const layerData = values.lots[layer];
                const newLot = await LotService.createLot({
                    productId: product.id,
                    productName: product.name,
                    layer: layer,
                    ...layerData
                });
                createdIds.push(newLot.id);
            }));

            message.success(`Batch Start Successful! Generated ${createdIds.length} Lots: ${createdIds.join(', ')}`);
            navigate('/history');
        } catch (error) {
            console.error('Batch start failed', error);
            message.error('Failed to start batch lots');
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        product,
        loading,
        selectedLayers,
        options,
        optionsLoading,
        handleLayerChange,
        submitBatch,
        context: {
            fabCode,
            costCenter
        }
    };
};

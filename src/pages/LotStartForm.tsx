import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Select, Button, Card, Descriptions, message, Space, Alert, Input, Divider, Badge } from 'antd';
import { ArrowLeftOutlined, CopyOutlined } from '@ant-design/icons';
import { MaskService, LotService, Product, FormOptions } from '../services/mockData';

const { Option } = Select;

const LotStartForm: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
    const [form] = Form.useForm();

    // Options State
    const [options, setOptions] = useState<FormOptions>({ fabs: [], reasons: [], priorities: [] });
    const [optionsLoading, setOptionsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            setOptionsLoading(true);
            try {
                const prod = MaskService.getProductById(productId);
                if (prod) {
                    setProduct(prod);
                } else {
                    message.error('Product not found');
                    navigate('/');
                }

                const opts = await LotService.getFormOptions();
                setOptions(opts);
            } catch (error) {
                console.error("Failed to fetch options", error);
                message.error("Failed to load form options");
            } finally {
                setOptionsLoading(false);
            }
        };
        fetchData();
    }, [productId, navigate]);

    const onFinish = (values: any) => {
        if (selectedLayers.length === 0) {
            message.error('Please select at least one layer');
            return;
        }

        if (!product) return;

        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            const createdIds: string[] = [];

            selectedLayers.forEach(layer => {
                const layerData = values.lots[layer];
                const newLot = LotService.createLot({
                    productId: product.id,
                    productName: product.name,
                    layer: layer,
                    ...layerData
                });
                createdIds.push(newLot.id);
            });

            message.success(`Batch Start Successful! Generated ${createdIds.length} Lots: ${createdIds.join(', ')}`);
            setLoading(false);
            navigate('/history');
        }, 1500);
    };

    const handleLayerChange = (layers: string[]) => {
        setSelectedLayers(layers);
    };

    if (!product) return null;

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16 }}
            >
                Back to Search
            </Button>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Product Information" bordered={false}>
                    <Descriptions column={2}>
                        <Descriptions.Item label="Product ID">{product.id}</Descriptions.Item>
                        <Descriptions.Item label="Product Name">{product.name}</Descriptions.Item>
                        <Descriptions.Item label="Tech Node">{product.tech}</Descriptions.Item>
                        <Descriptions.Item label="Total Layers">{product.layers.length}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Batch Lot Start" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Alert
                        message="Batch Processing Mode"
                        description="Select multiple layers to start. You will need to provide details for EACH selected layer below."
                        type="info"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{}}
                    >
                        <Form.Item
                            label="Select Target Layers"
                            required
                            tooltip="You can select multiple layers to start simultaneously"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select Layers (e.g., M1, M2...)"
                                onChange={handleLayerChange}
                                style={{ width: '100%' }}
                                size="large"
                            >
                                {product.layers.map(layer => (
                                    <Option key={layer} value={layer}>{layer}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {selectedLayers.length > 0 && (
                            <>
                                <Divider orientation="left">Layer Details Configuration</Divider>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {selectedLayers.map((layer, index) => (
                                        <Card
                                            key={layer}
                                            type="inner"
                                            title={
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                    <Space><Badge status="processing" /><span>Layer: <b>{layer}</b></span></Space>
                                                    {index > 0 && (
                                                        <Button
                                                            size="small"
                                                            htmlType="button"
                                                            icon={<CopyOutlined />}
                                                            onClick={() => {
                                                                const prevLayer = selectedLayers[index - 1];
                                                                const prevValues = form.getFieldValue(['lots', prevLayer]);
                                                                if (prevValues) {
                                                                    form.setFieldsValue({
                                                                        lots: {
                                                                            [layer]: { ...prevValues }
                                                                        }
                                                                    });
                                                                    message.success(`Copied from ${prevLayer}`);
                                                                } else {
                                                                    message.warning(`No data in ${prevLayer} to copy`);
                                                                }
                                                            }}
                                                        >
                                                            Copy from {selectedLayers[index - 1]}
                                                        </Button>
                                                    )}
                                                </div>
                                            }
                                            size="small"
                                            style={{ background: '#fafafa', borderColor: '#d9d9d9' }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                                <Form.Item
                                                    name={['lots', layer, 'fab']}
                                                    label="Target Fab"
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <Select loading={optionsLoading} disabled={optionsLoading} placeholder="Select Fab">
                                                        {options.fabs.map(fab => <Option key={fab} value={fab}>{fab}</Option>)}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name={['lots', layer, 'reason']}
                                                    label="Reason"
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <Select loading={optionsLoading} disabled={optionsLoading} placeholder="Select Reason">
                                                        {options.reasons.map(r => <Option key={r} value={r}>{r}</Option>)}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name={['lots', layer, 'priority']}
                                                    label="Priority"
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <Select loading={optionsLoading} disabled={optionsLoading} placeholder="Select Priority">
                                                        {options.priorities.map(p => <Option key={p} value={p}>{p}</Option>)}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <Form.Item
                                                name={['lots', layer, 'note']}
                                                label="Additional Notes"
                                            >
                                                <Input placeholder={`Notes for ${layer}...`} />
                                            </Form.Item>
                                        </Card>
                                    ))}
                                </div>

                                <Form.Item style={{ marginTop: 24 }}>
                                    <Button type="primary" htmlType="submit" icon={<CopyOutlined />} loading={loading} block size="large">
                                        Generate {selectedLayers.length} Lot IDs & Start Batch
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </Card>
            </Space>
        </div>
    );
};

export default LotStartForm;

import React, { useState } from 'react';
import { Input, Table, Button, Card, Tag, Typography, Select } from 'antd';
import { SearchOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProductSearch } from '../hooks/useProductSearch';
import { Product } from '../services/mockData';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const SearchPage: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [fabCode, setFabCode] = useState<string | null>(null);
    const [costCenter, setCostCenter] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        data,
        loading,
        fabCodes,
        costCenters,
        filtersLoading,
        search
    } = useProductSearch();

    const handleSearch = () => {
        search(searchText, fabCode || undefined, costCenter || undefined);
    };

    const columns: ColumnsType<Product> = [
        {
            title: 'Product ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <b>{text}</b>,
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tech Node',
            dataIndex: 'tech',
            key: 'tech',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Layers',
            dataIndex: 'layers',
            key: 'layers',
            render: (layers: any[]) => (
                <>
                    {layers.slice(0, 3).map(layer => (
                        <Tag key={layer.name}>{layer.name}</Tag>
                    ))}
                    {layers.length > 3 && <Tag>+{layers.length - 3}</Tag>}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<RocketOutlined />}
                    onClick={() => {
                        const params = new URLSearchParams();
                        if (fabCode) params.append('fabCode', fabCode);
                        if (costCenter) params.append('costCenter', costCenter);
                        navigate(`/start/${record.id}?${params.toString()}`);
                    }}
                >
                    Start Lot
                </Button>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <Title level={1} style={{ marginBottom: 16 }}>Mask Lot Start System</Title>
                <Typography.Text type="secondary" style={{ fontSize: 18 }}>
                    Search for a product mask to initiate a new production lot
                </Typography.Text>
            </div>

            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 32 }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: 24 }}>
                    <Input
                        size="large"
                        placeholder="Search by Product ID or Name..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ flex: 2 }}
                    />
                    <Select
                        size="large"
                        placeholder="Fab Code"
                        allowClear
                        style={{ flex: 1 }}
                        onChange={setFabCode}
                        loading={filtersLoading}
                        options={fabCodes.map(code => ({ label: code, value: code }))}
                    />
                    <Select
                        size="large"
                        placeholder="Cost Center"
                        allowClear
                        showSearch
                        style={{ flex: 1 }}
                        onChange={setCostCenter}
                        loading={filtersLoading}
                        options={costCenters.slice(0, 100).map(cc => ({ label: cc, value: cc }))}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                    <Button type="primary" size="large" onClick={handleSearch} loading={loading}>
                        Search
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    locale={{ emptyText: 'No products found. Try adjusting your search.' }}
                />
            </Card>
        </div>
    );
};

export default SearchPage;

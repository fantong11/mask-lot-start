import React, { useState } from 'react';
import { Input, Table, Button, Card, Tag, Typography, Select } from 'antd';
import { SearchOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MaskService } from '../services/mockData';

const { Title } = Typography;

const SearchPage = () => {
    const [searchText, setSearchText] = useState('');
    const [fabCode, setFabCode] = useState(null);
    const [costCenter, setCostCenter] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter Options State
    const [fabCodes, setFabCodes] = useState([]);
    const [costCenters, setCostCenters] = useState([]);
    const [filtersLoading, setFiltersLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch Filters on Mount
    React.useEffect(() => {
        const fetchFilters = async () => {
            setFiltersLoading(true);
            try {
                const [fabs, ccs] = await Promise.all([
                    MaskService.getFabCodes(),
                    MaskService.getCostCenters()
                ]);
                setFabCodes(fabs);
                setCostCenters(ccs);
            } catch (error) {
                console.error("Failed to fetch filters", error);
            } finally {
                setFiltersLoading(false);
            }
        };
        fetchFilters();
    }, []);

    const handleSearch = async () => {
        // Allow search if any field is filled
        if (!searchText && !fabCode && !costCenter) return;

        setLoading(true);
        try {
            const results = await MaskService.searchProducts(searchText, { fabCode, costCenter });
            setData(results);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Product ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
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
            render: (tech) => <Tag color="blue">{tech}</Tag>,
        },
        {
            title: 'Available Layers',
            dataIndex: 'layers',
            key: 'layers',
            render: (layers) => (
                <span>{layers.length} Layers</span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<RocketOutlined />}
                    onClick={() => navigate(`/start/${record.id}`)}
                >
                    Select Product
                </Button>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ textAlign: 'center' }}>Find a Product to Start Lot</Title>

                <Card bordered={false} style={{ marginTop: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                        <div>
                            <Typography.Text strong>Product ID / Name</Typography.Text>
                            <Input
                                placeholder="e.g., N3_LOGIC..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                size="large"
                                style={{ marginTop: 8 }}
                            />
                        </div>

                        <div>
                            <Typography.Text strong>Fab Code (Origin)</Typography.Text>
                            <Select
                                placeholder="Select Fab Code"
                                allowClear
                                style={{ width: '100%', marginTop: 8 }}
                                size="large"
                                onChange={setFabCode}
                                loading={filtersLoading}
                                disabled={filtersLoading}
                                options={fabCodes.map(code => ({ label: code, value: code }))}
                            />
                        </div>

                        <div>
                            <Typography.Text strong>Cost Center</Typography.Text>
                            <Select
                                placeholder="Select Cost Center"
                                allowClear
                                showSearch
                                style={{ width: '100%', marginTop: 8 }}
                                size="large"
                                onChange={setCostCenter}
                                loading={filtersLoading}
                                disabled={filtersLoading}
                                options={costCenters.map(cc => ({ label: cc, value: cc }))}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                virtual={true}
                            />
                        </div>

                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            loading={loading}
                            onClick={handleSearch}
                            size="large"
                            style={{ marginBottom: 1 }}
                        >
                            Search
                        </Button>
                    </div>
                </Card>
            </div>

            <Card title="Shipped Products / Models" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default SearchPage;

import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Card, Typography, DatePicker, Space } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LotService, Lot } from '../services/mockData';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const HistoryDashboard: React.FC = () => {
    const [allData, setAllData] = useState<Lot[]>([]); // Store all data
    const [filteredData, setFilteredData] = useState<Lot[]>([]); // Store filtered data for display
    const [loading, setLoading] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

    const loadData = () => {
        setLoading(true);
        const lots = LotService.getLots();
        // Simulate network delay
        setTimeout(() => {
            setAllData(lots);
            // Apply current filter if exists, otherwise show all
            filterData(lots, dateRange);
            setLoading(false);
        }, 500);
    };

    const filterData = (data: Lot[], range: [Dayjs | null, Dayjs | null] | null) => {
        if (!range || !range[0] || !range[1]) {
            setFilteredData(data);
            return;
        }

        const [start, end] = range;
        const filtered = data.filter(item => {
            const itemDate = dayjs(item.createdAt);
            return itemDate.isAfter(start.startOf('day')) && itemDate.isBefore(end.endOf('day'));
        });
        setFilteredData(filtered);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Re-filter when date range changes
    useEffect(() => {
        filterData(allData, dateRange);
    }, [dateRange, allData]);

    const columns: ColumnsType<Lot> = [
        {
            title: 'Lot ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
        },
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
            render: (text: string) => <b>{text}</b>,
        },
        {
            title: 'Layer',
            dataIndex: 'layer',
            key: 'layer',
            render: (text: string) => <Tag color="purple">{text}</Tag>,
        },
        {
            title: 'Fab',
            dataIndex: 'fab',
            key: 'fab',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => {
                let color = 'blue';
                if (priority === 'Urgent') color = 'red';
                if (priority === 'Low') color = 'default';
                return <Tag color={color}>{priority}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                let icon = <ClockCircleOutlined />;
                if (status === 'Approved') {
                    color = 'success';
                    icon = <CheckCircleOutlined />;
                } else if (status === 'Pending') {
                    color = 'processing';
                    icon = <SyncOutlined spin />;
                }
                return <Tag icon={icon} color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Space>
                    <ClockCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Title level={2} style={{ margin: 0 }}>Lot History</Title>
                </Space>
                <Space>
                    <RangePicker
                        onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
                        style={{ width: 300 }}
                    />
                    <Button icon={<SyncOutlined />} onClick={loadData}>Refresh</Button>
                </Space>
            </div>

            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default HistoryDashboard;

import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Card, Typography, Tooltip, message, Space, Popconfirm } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LotService } from '../services/mockData';

const { Title } = Typography;

const ApprovalPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = () => {
        setLoading(true);
        const lots = LotService.getLots();
        // Simulate network delay
        setTimeout(() => {
            // Filter for Pending items only
            const pendingLots = lots.filter(lot => lot.status === 'Pending');
            setData(pendingLots);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStatusUpdate = async (record, newStatus) => {
        try {
            await LotService.updateStatus(record.id, newStatus);
            message.success(`Lot ${record.id} ${newStatus === 'Approved' ? 'Approved' : 'Rejected'}`);
            loadData(); // Reload to remove the item from the list
        } catch (error) {
            message.error("Failed to update status");
        }
    };

    const columns = [
        {
            title: 'Lot ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
        },
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Layer',
            dataIndex: 'layer',
            key: 'layer',
            render: (text) => <Tag color="purple">{text}</Tag>,
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
            render: (priority) => {
                let color = 'blue';
                if (priority === 'Urgent') color = 'red';
                if (priority === 'Low') color = 'default';
                return <Tag color={color}>{priority}</Tag>;
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Approve this lot?"
                        onConfirm={() => handleStatusUpdate(record, 'Approved')}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
                            Approve
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Reject this lot?"
                        onConfirm={() => handleStatusUpdate(record, 'Rejected')}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger size="small" icon={<CloseCircleOutlined />}>
                            Reject
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Pending Approvals</Title>
                <Button icon={<SyncOutlined />} onClick={loadData} loading={loading}>
                    Refresh
                </Button>
            </div>

            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    locale={{ emptyText: 'No pending approvals' }}
                />
            </Card>
        </div>
    );
};

export default ApprovalPage;

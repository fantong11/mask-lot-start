import React, { useEffect } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { CheckCircle, XCircle, RefreshCcw, ShieldCheck, Clock } from 'lucide-react';
import { useLotHistory } from '../hooks/useLotHistory';
import { useLotAction } from '../hooks/useLotAction';
import { Lot } from '../services/mockData';
import type { ColumnsType } from 'antd/es/table';

const ApprovalPage: React.FC = () => {
    const { allData, loadData, filterByStatus } = useLotHistory();
    const { loading: actionLoading, updateStatus } = useLotAction();

    useEffect(() => {
        filterByStatus('Pending');
    }, [filterByStatus]);

    const pendingData = allData.filter(lot => lot.status === 'Pending');

    const handleStatusUpdate = (record: Lot, newStatus: Lot['status']) => {
        updateStatus(record.id, newStatus, () => {
            loadData();
        });
    };

    const columns: ColumnsType<Lot> = [
        {
            title: 'Lot ID',
            dataIndex: 'id',
            key: 'id',
            className: 'font-mono text-sm font-medium text-slate-600',
        },
        {
            title: 'Product ID',
            dataIndex: 'productId',
            key: 'productId',
            className: 'font-semibold text-slate-800',
        },
        {
            title: 'Layer',
            dataIndex: 'layer',
            key: 'layer',
            render: (text: string) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {text}
                </span>
            ),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            className: 'text-slate-600',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string) => {
                let badgeClass = 'bg-sky-50 text-sky-700 border-sky-100';
                if (priority === 'Urgent') badgeClass = 'bg-rose-50 text-rose-700 border-rose-100';
                if (priority === 'Low') badgeClass = 'bg-slate-50 text-slate-600 border-slate-200';

                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                        {priority}
                    </span>
                );
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => (
                <span className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(date).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Popconfirm
                        title={<span className="font-semibold text-slate-700">Approve this mask lot?</span>}
                        description={<span className="text-slate-500">This will initiate the downstream flow.</span>}
                        onConfirm={() => handleStatusUpdate(record, 'Approved')}
                        okText="Approve"
                        cancelText="Cancel"
                        okButtonProps={{ className: "bg-emerald-500 hover:bg-emerald-400 border-emerald-500 hover:border-emerald-400 shadow-sm shadow-emerald-500/30" }}
                    >
                        <Button
                            type="primary"
                            className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 shadow-none flex items-center px-3"
                            loading={actionLoading}
                        >
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title={<span className="font-semibold text-rose-700">Reject this mask lot?</span>}
                        description={<span className="text-slate-500">This action cannot be undone.</span>}
                        onConfirm={() => handleStatusUpdate(record, 'Rejected')}
                        okText="Reject"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true, className: "bg-rose-500 hover:bg-rose-400 border-none shadow-sm shadow-rose-500/30" }}
                    >
                        <Button
                            danger
                            className="flex items-center px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 hover:border-rose-300 transition-colors"
                            loading={actionLoading}
                        >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pending Approvals</h1>
                        <p className="text-sm text-slate-500">Review and authorize pending lot start requests.</p>
                    </div>
                </div>

                <Button
                    icon={<RefreshCcw className="w-4 h-4 mr-1.5" />}
                    onClick={loadData}
                    className="h-10 px-4 flex items-center rounded-lg border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-colors"
                >
                    Refresh List
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={pendingData}
                    rowKey="id"
                    loading={actionLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        className: "px-6 py-4 border-t border-slate-50 m-0"
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                                <ShieldCheck className="w-12 h-12 mb-4 text-emerald-400/50" />
                                <p className="text-lg font-medium text-slate-600">All caught up!</p>
                                <p className="text-sm">There are no pending lot approvals right now.</p>
                            </div>
                        )
                    }}
                    className="[&_.ant-table-thead>tr>th]:bg-slate-50/80 [&_.ant-table-thead>tr>th]:text-slate-500 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:text-xs [&_.ant-table-thead>tr>th]:tracking-wider"
                />
            </div>
        </div>
    );
};

export default ApprovalPage;

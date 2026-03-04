import React, { useEffect, useState } from 'react';
import { Table, Button, DatePicker } from 'antd';
import { CheckCircle, Clock, RefreshCcw, Activity } from 'lucide-react';
import { useLotHistory } from '../hooks/useLotHistory';
import { Lot } from '../services/mockData';
import { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

const HistoryDashboard: React.FC = () => {
    const { filteredData, loading, loadData, filterByDate } = useLotHistory();
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

    useEffect(() => {
        filterByDate(dateRange);
    }, [dateRange, filterByDate]);

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
            className: 'font-semibold text-slate-700',
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
            title: 'Fab',
            dataIndex: 'fab',
            key: 'fab',
            className: 'text-slate-600',
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const isApproved = status === 'Approved';
                return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${isApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {isApproved ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 animate-pulse" />}
                        {status.toUpperCase()}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lot History</h1>
                        <p className="text-sm text-slate-500">Monitor your mask production initialization logs and statuses.</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <RangePicker
                        onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
                        className="w-full sm:w-72 h-10 rounded-lg hover:border-indigo-400 focus:border-indigo-500"
                    />
                    <Button
                        icon={<RefreshCcw className="w-4 h-4 mr-1.5" />}
                        onClick={loadData}
                        className="h-10 px-4 flex items-center rounded-lg border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                    >
                        Refresh Data
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        className: "px-6 py-4 border-t border-slate-50 m-0"
                    }}
                    className="[&_.ant-table-thead>tr>th]:bg-slate-50/80 [&_.ant-table-thead>tr>th]:text-slate-500 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:text-xs [&_.ant-table-thead>tr>th]:tracking-wider"
                />
            </div>
        </div>
    );
};

export default HistoryDashboard;

import React, { useState } from 'react';
import { Input, Table, Button, Tag, Select } from 'antd';
import { Search as SearchIcon, Rocket, Filter, Briefcase, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductSearch } from '../hooks/useProductSearch';
import { Product } from '../services/mockData';
import type { ColumnsType } from 'antd/es/table';

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
            className: 'font-semibold text-slate-700',
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            className: 'text-slate-600',
        },
        {
            title: 'Tech Node',
            dataIndex: 'tech',
            key: 'tech',
            render: (text: string) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    <Zap className="w-3 h-3 mr-1" />
                    {text}
                </span>
            ),
        },
        {
            title: 'Layers',
            dataIndex: 'layers',
            key: 'layers',
            render: (layers: any[]) => (
                <div className="flex flex-wrap gap-1.5">
                    {layers.slice(0, 3).map(layer => (
                        <Tag key={layer.name} className="m-0 border-slate-200 bg-slate-50 text-slate-600 rounded-md">
                            {layer.name}
                        </Tag>
                    ))}
                    {layers.length > 3 && (
                        <Tag className="m-0 border-dashed border-slate-300 bg-white text-slate-400 rounded-md">
                            +{layers.length - 3}
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    className="flex items-center shadow-sm shadow-sky-500/30 hover:shadow-sky-500/50 transition-shadow"
                    onClick={() => {
                        const params = new URLSearchParams();
                        if (fabCode) params.append('fabCode', fabCode);
                        if (costCenter) params.append('costCenter', costCenter);
                        navigate(`/start/${record.id}?${params.toString()}`);
                    }}
                >
                    <Rocket className="w-4 h-4 mr-1.5" /> Start Lot
                </Button>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-800 to-sky-900 text-white shadow-xl shadow-sky-900/20 p-8 sm:p-12"
            >
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
                <div className="relative z-10 max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
                    >
                        Mask Lot Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">System</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-lg text-slate-300 mb-8 max-w-xl"
                    >
                        Locate your target product mask, define production parameters, and instantly start new lots with precision and speed.
                    </motion.p>

                    {/* Primary Search Bar Overlapping visually */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Input
                            size="large"
                            className="h-14 rounded-xl text-lg shadow-inner"
                            placeholder="Enter Product ID or Name..."
                            prefix={<SearchIcon className="text-slate-400 mr-2" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                        />
                        <Button
                            type="primary"
                            size="large"
                            className="h-14 px-8 rounded-xl text-lg font-semibold bg-sky-500 hover:bg-sky-400 border-none shadow-lg shadow-sky-500/40"
                            onClick={handleSearch}
                            loading={loading}
                        >
                            Search
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Filters and Results Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                    <div className="flex w-full sm:w-1/2 gap-4">
                        <div className="w-1/2 relative">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Target Fab</label>
                            <Select
                                size="large"
                                placeholder="Select Fab"
                                allowClear
                                className="w-full"
                                onChange={setFabCode}
                                loading={filtersLoading}
                                options={fabCodes.map(code => ({ label: code, value: code }))}
                                suffixIcon={<Filter className="w-4 h-4 text-slate-400" />}
                            />
                        </div>
                        <div className="w-1/2 relative">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Cost Center</label>
                            <Select
                                size="large"
                                placeholder="Select Center"
                                allowClear
                                showSearch
                                className="w-full"
                                onChange={setCostCenter}
                                loading={filtersLoading}
                                options={costCenters.slice(0, 100).map(cc => ({ label: cc, value: cc }))}
                                suffixIcon={<Briefcase className="w-4 h-4 text-slate-400" />}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </div>
                    </div>
                    {/* Active Filters Tag Area (Optional extra UI) */}
                    <div className="w-full sm:w-1/2 flex items-end sm:justify-end">
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                            {data.length} products found
                        </span>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200/60">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            className: "px-4"
                        }}
                        locale={{ emptyText: 'No products found. Adjust filters to search.' }}
                        className="[&_.ant-table-thead>tr>th]:bg-slate-50 [&_.ant-table-thead>tr>th]:text-slate-500 [&_.ant-table-thead>tr>th]:font-semibold"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

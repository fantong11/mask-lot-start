import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Select, Button, Input, message, Tag } from 'antd';
import { ArrowLeft, Copy, Layers as LayersIcon, MapPin, Building2, AlignLeft, Info, Rocket } from 'lucide-react';
import { useLotStartForm } from '../hooks/useLotStartForm';

const { Option } = Select;

const LotStartForm: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const {
        form,
        product,
        loading,
        selectedLayers,
        options,
        optionsLoading,
        handleLayerChange,
        submitBatch,
        context
    } = useLotStartForm(productId);

    if (!product) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm w-fit"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
            </button>

            {/* Product Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <LayersIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{product.name}</h2>
                                <p className="text-sm text-slate-500 font-mono tracking-wide">ID: {product.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Tech Node</p>
                            <p className="font-semibold text-slate-700">{product.tech}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Total Layers</p>
                            <p className="font-semibold text-slate-700">{product.layers.length}</p>
                        </div>
                        {context.fabCode && (
                            <div>
                                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Fab Code</p>
                                <Tag className="m-0 bg-blue-50 text-blue-700 border-blue-200">{context.fabCode}</Tag>
                            </div>
                        )}
                        {context.costCenter && (
                            <div>
                                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Cost Center</p>
                                <Tag className="m-0 bg-emerald-50 text-emerald-700 border-emerald-200">{context.costCenter}</Tag>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Batch Start Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Batch Lot Start Configuration</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Select and configure multiple layers to initiate production simultaneously.</p>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Information Alert */}
                    <div className="mb-8 p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-start">
                        <Info className="w-5 h-5 text-sky-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-sky-800 mb-1">Batch Processing Mode</h4>
                            <p className="text-sm text-sky-600/90 leading-relaxed">
                                You can select multiple product layers from the dropdown below. Once selected, individual configuration panels will appear for each layer, allowing you to define distinct routing and priorities before submission.
                            </p>
                        </div>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={submitBatch}
                        initialValues={{}}
                        className="space-y-8"
                    >
                        <Form.Item
                            name="targetLayers"
                            label={<span className="font-semibold text-slate-700">Target Layers Selection <span className="text-red-500">*</span></span>}
                            className="m-0"
                            tooltip={{ title: "Select layers defined in the product specification route.", icon: <Info className="w-4 h-4 text-slate-400" /> }}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Click to select layers (e.g., M1, M2...)"
                                onChange={handleLayerChange}
                                className="w-full text-base"
                                size="large"
                                optionLabelProp="label"
                                virtual={false}
                                maxTagCount="responsive"
                            >
                                {product.layers.map((layer: any) => (
                                    <Option key={layer.name} value={layer.name} label={layer.name}>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="font-medium">{layer.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                                                    {layer.maskId} (Rev: {layer.revision})
                                                </span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wide ${layer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {layer.status}
                                                </span>
                                            </div>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {selectedLayers.length > 0 && (
                            <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h4 className="text-sm uppercase tracking-wider font-bold text-slate-500 flex items-center">
                                    <AlignLeft className="w-4 h-4 mr-2" />
                                    Layer Configurations
                                </h4>

                                <div className="space-y-4">
                                    {selectedLayers.map((layer, index) => (
                                        <div
                                            key={layer}
                                            className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-sky-300 hover:shadow-md hover:shadow-sky-100/50"
                                        >
                                            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                                                <div className="flex items-center">
                                                    <span className="flex h-2.5 w-2.5 relative mr-2.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                                                    </span>
                                                    <span className="font-semibold text-slate-700">Layer {layer}</span>
                                                </div>

                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors flex items-center"
                                                        onClick={() => {
                                                            const prevLayer = selectedLayers[index - 1];
                                                            const prevValues = form.getFieldValue(['lots', prevLayer]);
                                                            if (prevValues) {
                                                                form.setFieldsValue({
                                                                    lots: {
                                                                        [layer]: { ...prevValues }
                                                                    }
                                                                });
                                                                message.success(`Applied configuration from ${prevLayer}`);
                                                            } else {
                                                                message.warning(`No data in ${prevLayer} to copy yet`);
                                                            }
                                                        }}
                                                    >
                                                        <Copy className="w-3 h-3 mr-1.5" />
                                                        Mirror {selectedLayers[index - 1]}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                                                <Form.Item
                                                    name={['lots', layer, 'fab']}
                                                    label={<span className="text-xs font-semibold text-slate-500 flex items-center"><Building2 className="w-3.5 h-3.5 mr-1.5" />Target Fab</span>}
                                                    rules={[{ required: true, message: 'Fab is required' }]}
                                                    className="m-0"
                                                >
                                                    <Select loading={optionsLoading} disabled={optionsLoading} placeholder="Select Fab" size="large" className="w-full">
                                                        {options.fabs.map(fab => <Option key={fab} value={fab}>{fab}</Option>)}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name={['lots', layer, 'reason']}
                                                    label={<span className="text-xs font-semibold text-slate-500 flex items-center"><Info className="w-3.5 h-3.5 mr-1.5" />Reason</span>}
                                                    rules={[{ required: true, message: 'Reason is required' }]}
                                                    className="m-0"
                                                >
                                                    <Select loading={optionsLoading} disabled={optionsLoading} placeholder="Select Reason" size="large" className="w-full">
                                                        {options.reasons.map(r => <Option key={r} value={r}>{r}</Option>)}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name={['lots', layer, 'priority']}
                                                    label={<span className="text-xs font-semibold text-slate-500 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5" />Priority</span>}
                                                    rules={[{ required: true, message: 'Priority is required' }]}
                                                    className="m-0"
                                                >
                                                    <Select loading={optionsLoading} disabled={optionsLoading} placeholder="Select Priority" size="large" className="w-full">
                                                        {options.priorities.map(p => <Option key={p} value={p}>{p}</Option>)}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name={['lots', layer, 'note']}
                                                    label={<span className="text-xs font-semibold text-slate-500">Additional Instructions (Optional)</span>}
                                                    className="m-0 md:col-span-3"
                                                >
                                                    <Input placeholder={`Specific notes, handling instructions, or references for ${layer}...`} className="rounded-lg" size="large" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 border-none shadow-lg shadow-sky-500/30 flex items-center justify-center transition-all hover:scale-[1.01]"
                                    >
                                        <Rocket className="w-5 h-5 mr-2" />
                                        Initialize {selectedLayers.length} Production Lot{selectedLayers.length > 1 ? 's' : ''}
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                                        Submitting will generate preliminary Lot IDs and send requests to the MES system for approval.
                                    </p>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LotStartForm;

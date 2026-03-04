import React, { useState } from 'react';
import { Typography, Dropdown, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, History, CheckCircle, Search, Menu as MenuIcon, X } from 'lucide-react';

const { Title } = Typography;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        {
            key: '/',
            icon: <Search className="w-4 h-4 mr-2" />,
            label: 'Mask Search',
        },
        {
            key: '/history',
            icon: <History className="w-4 h-4 mr-2" />,
            label: 'History Dashboard',
        },
        {
            key: '/approval',
            icon: <CheckCircle className="w-4 h-4 mr-2" />,
            label: 'Approvals',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                                <Layers size={22} className="text-white" />
                            </div>
                            <Title level={4} style={{ margin: 0 }} className="hidden sm:block text-slate-800 font-semibold tracking-tight">
                                Mask Lot Start
                            </Title>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => navigate(item.key)}
                                        className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-sky-50 text-sky-600 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                            }`}
                                    >
                                        {React.cloneElement(item.icon, {
                                            className: `w-4 h-4 mr-2 ${isActive ? 'text-sky-500' : 'text-slate-400'}`
                                        })}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* User Profile / Context Area */}
                        <div className="hidden md:flex items-center gap-4">
                            <Dropdown menu={{ items: [{ key: '1', label: 'Logout' }] }} placement="bottomRight">
                                <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                                    <Avatar size="small" className="bg-sky-100 text-sky-700 font-semibold">U</Avatar>
                                </button>
                            </Dropdown>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full z-40">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => {
                                            navigate(item.key);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`flex w-full items-center px-3 py-3 rounded-md text-base font-medium ${isActive ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {React.cloneElement(item.icon, {
                                            className: `w-5 h-5 mr-3 ${isActive ? 'text-sky-500' : 'text-slate-400'}`
                                        })}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-200/60 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                        <Layers size={16} /> Mask Lot Start System
                    </p>
                    <p className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} Designed by Antigravity
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

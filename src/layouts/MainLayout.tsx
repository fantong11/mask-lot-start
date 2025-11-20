import React from 'react';
import { Layout, Menu, Typography, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchOutlined, HistoryOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        {
            key: '/',
            icon: <SearchOutlined />,
            label: 'Mask Search',
        },
        {
            key: '/history',
            icon: <HistoryOutlined />,
            label: 'History',
        },
        {
            key: '/approval',
            icon: <CheckCircleOutlined />,
            label: 'Approval',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '48px' }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        background: '#1890ff',
                        borderRadius: 6,
                        marginRight: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>M</div>
                    <Title level={4} style={{ color: 'white', margin: 0 }}>Mask Lot Start</Title>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={items}
                    onClick={({ key }) => navigate(key)}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '24px 48px' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Mask Lot Start System ©{new Date().getFullYear()} Created by Antigravity
            </Footer>
        </Layout>
    );
};

export default MainLayout;

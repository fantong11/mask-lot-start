import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './layouts/MainLayout';
import SearchPage from './pages/SearchPage';
import LotStartForm from './pages/LotStartForm';
import HistoryDashboard from './pages/HistoryDashboard';
import ApprovalPage from './pages/ApprovalPage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Inter', sans-serif",
          colorPrimary: '#0ea5e9', // Tailwind sky-500
          borderRadius: 8,
          colorBgContainer: '#ffffff',
        },
      }}
    >
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/start/:productId" element={<LotStartForm />} />
            <Route path="/history" element={<HistoryDashboard />} />
            <Route path="/approval" element={<ApprovalPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;

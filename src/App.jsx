import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SearchPage from './pages/SearchPage';
import LotStartForm from './pages/LotStartForm';
import HistoryDashboard from './pages/HistoryDashboard';
import ApprovalPage from './pages/ApprovalPage';

function App() {
  return (
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
  );
}

export default App;

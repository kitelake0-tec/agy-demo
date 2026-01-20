import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import BranchList from './pages/BranchList';
import BranchDetail from './pages/BranchDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/branches" element={<BranchList />} />
          <Route path="/branch/:branchId" element={<BranchDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

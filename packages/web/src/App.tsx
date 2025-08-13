import {FC} from 'react';
import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout.js';
import Dashboard from './pages/Dashboard.js';
import Chores from './pages/Chores.js';
import Goals from './pages/Goals.js';
import Leaderboard from './pages/Leaderboard.js';
import Admin from './pages/Admin.js';

const App: FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chores" element={<Chores />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  );
};

export default App;

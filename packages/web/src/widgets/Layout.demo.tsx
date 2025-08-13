import {FC} from 'react';
import Layout, {NavigationItem} from './Layout.js';

const nav: NavigationItem[] = [
  {name: 'Dashboard', path: '/', icon: '🏠'},
  {name: 'Chores', path: '/chores', icon: '📋'},
  {name: 'Goals', path: '/goals', icon: '🎯'},
  {name: 'Leaderboard', path: '/leaderboard', icon: '🏆'},
];

const LayoutDemo: FC = () => {
  return (
    <div data-testid="LayoutDemo">
      <Layout navigation={nav}>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Demo Content</h2>
          <p className="text-gray-600">
            This is rendered inside the Layout content area.
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default LayoutDemo;

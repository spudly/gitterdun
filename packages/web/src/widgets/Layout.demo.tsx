import type {FC} from 'react';
import type {NavigationItem} from './Layout.js';
import Layout from './Layout.js';

const nav: Array<NavigationItem> = [
  {message: {defaultMessage: 'Dashboard'}, path: '/', icon: '🏠'},
  {message: {defaultMessage: 'Chores'}, path: '/chores', icon: '📋'},
  {message: {defaultMessage: 'Goals'}, path: '/goals', icon: '🎯'},
  {message: {defaultMessage: 'Leaderboard'}, path: '/leaderboard', icon: '🏆'},
];

const LayoutDemo: FC = () => {
  return (
    <div>
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

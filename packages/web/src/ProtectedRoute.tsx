import type {FC, ReactElement} from 'react';
import {Navigate} from 'react-router-dom';
import {Spinner} from './widgets/Spinner.js';
import {useUser} from './hooks/useUser.js';

type ProtectedRouteProps = {readonly children: ReactElement};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({children}) => {
  const {user, isLoading} = useUser();
  if (isLoading) {
    return <Spinner />;
  }
  if (!user) {
    return <Navigate replace to="/landing" />;
  }
  return children;
};

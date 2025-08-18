import type {FC} from 'react';
import {Spinner} from './Spinner.js';

type PageLoadingProps = {readonly message?: string};

export const PageLoading: FC<PageLoadingProps> = ({message = 'Loading...'}) => {
  return (
    <div className="text-center">
      <Spinner size="lg" />

      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default PageLoading;

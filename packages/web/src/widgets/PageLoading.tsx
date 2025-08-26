import type {FC} from 'react';
import {Spinner} from './Spinner.js';

type PageLoadingProps = {readonly message?: string};

export const PageLoading: FC<PageLoadingProps> = ({message = 'Loading...'}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />

      <p className="text-gray-600">{message}</p>
    </div>
  );
};

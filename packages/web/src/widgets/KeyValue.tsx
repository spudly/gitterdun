import type {FC, ReactNode} from 'react';

export type KeyValueProps = {
  readonly label: ReactNode;
  readonly value: ReactNode;
};

export const KeyValue: FC<KeyValueProps> = ({label, value}) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
};

export default KeyValue;

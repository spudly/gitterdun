import {FC} from 'react';

export interface ProgressBarProps {
  value: number; // 0..100
  showPercent?: boolean;
  className?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  showPercent = false,
  className = '',
}) => {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{width: `${safe}%`}}
        />
      </div>
      {showPercent && (
        <div className="text-xs text-gray-500 text-center mt-1">
          {Math.round(safe)}% Complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

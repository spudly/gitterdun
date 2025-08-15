import type {FC} from 'react';
import {StatusBadge} from './StatusBadge.js';

const StatusBadgeDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">StatusBadge Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Status Types</h3>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status="success">Success</StatusBadge>

          <StatusBadge status="error">Error</StatusBadge>

          <StatusBadge status="warning">Warning</StatusBadge>

          <StatusBadge status="info">Info</StatusBadge>

          <StatusBadge status="pending">Pending</StatusBadge>

          <StatusBadge status="completed">Completed</StatusBadge>

          <StatusBadge status="approved">Approved</StatusBadge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-16">Small:</span>

            <StatusBadge size="sm" status="success">
              Success
            </StatusBadge>

            <StatusBadge size="sm" status="error">
              Error
            </StatusBadge>

            <StatusBadge size="sm" status="warning">
              Warning
            </StatusBadge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-16">Medium:</span>

            <StatusBadge size="md" status="success">
              Success
            </StatusBadge>

            <StatusBadge size="md" status="error">
              Error
            </StatusBadge>

            <StatusBadge size="md" status="warning">
              Warning
            </StatusBadge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-16">Large:</span>

            <StatusBadge size="lg" status="success">
              Success
            </StatusBadge>

            <StatusBadge size="lg" status="error">
              Error
            </StatusBadge>

            <StatusBadge size="lg" status="warning">
              Warning
            </StatusBadge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Content</h3>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status="success">✓ Completed</StatusBadge>

          <StatusBadge status="error">✗ Failed</StatusBadge>

          <StatusBadge status="warning">⚠ Pending Review</StatusBadge>

          <StatusBadge status="info">ℹ In Progress</StatusBadge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chore Status Examples</h3>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status="pending">Pending</StatusBadge>

          <StatusBadge status="completed">Completed</StatusBadge>

          <StatusBadge status="approved">Approved</StatusBadge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <div className="flex flex-wrap gap-2">
          <StatusBadge bold outlined status="success">
            Custom Success
          </StatusBadge>

          <StatusBadge outlined status="error" uppercase wide>
            Custom Error
          </StatusBadge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Usage in Context</h3>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Task Status</span>

            <StatusBadge status="completed">Completed</StatusBadge>
          </div>

          <p className="text-sm text-gray-600">
            This shows how the StatusBadge can be used inline with other
            content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusBadgeDemo;

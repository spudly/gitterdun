import type {FC} from 'react';
import { useState} from 'react';
import {Alert} from './Alert.js';

const AlertDemo: FC = () => {
  const [dismissibleAlert, setDismissibleAlert] = useState(true);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Alert Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Alert Types</h3>

        <Alert type="success">
          This is a success alert with a helpful message.
        </Alert>

        <Alert type="error">
          This is an error alert showing something went wrong.
        </Alert>

        <Alert type="warning">This is a warning alert to draw attention.</Alert>

        <Alert type="info">
          This is an info alert with general information.
        </Alert>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Titles</h3>

        <Alert title="Success!" type="success">
          Your changes have been saved successfully.
        </Alert>

        <Alert title="Error Occurred" type="error">
          There was a problem processing your request.
        </Alert>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dismissible Alert</h3>

        {dismissibleAlert ? (
          <Alert
            onDismiss={() => {
              setDismissibleAlert(false);
            }}
            title="Dismissible Alert"
            type="info"
          >
            This alert can be dismissed by clicking the X button.
          </Alert>
        ) : null}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setDismissibleAlert(true);
          }}
          type="button"
        >
          Show Alert Again
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <Alert outlined type="warning">
          This alert has custom styling applied.
        </Alert>
      </div>
    </div>
  );
};

export default AlertDemo;

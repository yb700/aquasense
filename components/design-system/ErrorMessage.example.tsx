import React from 'react';
import { ErrorMessage } from './ErrorMessage';

/**
 * ErrorMessage Component Examples
 * 
 * Demonstrates various use cases of the ErrorMessage component
 * with different variants, configurations, and content.
 */

export const ErrorMessageExamples = () => {
  const [showDismissible, setShowDismissible] = React.useState(true);
  const [showToast, setShowToast] = React.useState(true);

  return (
    <div className="space-y-8 p-8 bg-background">
      <section>
        <h2 className="text-2xl font-bold mb-4">Inline Variant (Default)</h2>
        <div className="space-y-4">
          <ErrorMessage message="This is a simple inline error message." />
          
          <ErrorMessage
            message="This error has a title for additional context."
            title="Validation Error"
          />
          
          <ErrorMessage
            message="Invalid email address. Please enter a valid email."
            title="Form Error"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Toast Variant</h2>
        <div className="space-y-4">
          <ErrorMessage
            message="Your changes have been saved successfully."
            variant="toast"
          />
          
          <ErrorMessage
            message="Unable to connect to the server. Please try again later."
            title="Connection Error"
            variant="toast"
          />
          
          {showToast && (
            <ErrorMessage
              message="This toast notification can be dismissed."
              title="Notification"
              variant="toast"
              dismissible={true}
              onDismiss={() => setShowToast(false)}
            />
          )}
          {!showToast && (
            <button
              onClick={() => setShowToast(true)}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Show Toast Again
            </button>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Alert Variant</h2>
        <div className="space-y-4">
          <ErrorMessage
            message="Please save your work before navigating away from this page."
            variant="alert"
          />
          
          <ErrorMessage
            message="Your session will expire in 5 minutes. Please save your work."
            title="Session Warning"
            variant="alert"
          />
          
          <ErrorMessage
            message="This system will undergo maintenance from 2 AM to 4 AM."
            title="Scheduled Maintenance"
            variant="alert"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Dismissible Messages</h2>
        <div className="space-y-4">
          {showDismissible && (
            <ErrorMessage
              message="This message can be dismissed by clicking the X button."
              dismissible={true}
              onDismiss={() => setShowDismissible(false)}
            />
          )}
          {!showDismissible && (
            <button
              onClick={() => setShowDismissible(true)}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Show Dismissible Message Again
            </button>
          )}
          
          <ErrorMessage
            message="Dismissible alert with a title and custom styling."
            title="Dismissible Alert"
            variant="alert"
            dismissible={true}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Long Messages</h2>
        <div className="space-y-4">
          <ErrorMessage
            message="This is a longer error message that demonstrates how the component handles multi-line text. The message wraps properly and maintains good readability with appropriate line height and spacing. The icon stays aligned at the top while the text flows naturally."
            title="Detailed Error Information"
          />
          
          <ErrorMessage
            message="Authentication failed: The provided credentials are invalid. Please verify your email address and password, then try again. If you continue to experience issues, please use the 'Forgot Password' link to reset your password or contact support for assistance."
            title="Authentication Error"
            variant="toast"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Styling</h2>
        <div className="space-y-4">
          <ErrorMessage
            message="This message has custom margin and width applied."
            className="max-w-md mx-auto"
          />
          
          <ErrorMessage
            message="Custom padding and background opacity can be overridden."
            variant="toast"
            className="shadow-xl"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Real-World Use Cases</h2>
        <div className="space-y-4">
          <ErrorMessage
            message="Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
            title="Password Requirements"
          />
          
          <ErrorMessage
            message="File upload failed: The file size exceeds the maximum allowed size of 10MB."
            title="Upload Error"
            variant="inline"
          />
          
          <ErrorMessage
            message="Your payment was processed successfully. You will receive a confirmation email shortly."
            variant="toast"
            dismissible={true}
          />
          
          <ErrorMessage
            message="Database backup is scheduled to run tonight at 11 PM. The system may be slower during this time."
            title="System Notification"
            variant="alert"
          />
        </div>
      </section>
    </div>
  );
};

export default ErrorMessageExamples;

import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ message = "Something went wrong. Please try again later." }) => (
  <div className="flex flex-col items-center justify-center h-64 text-red-500">
    <AlertTriangle className="w-16 h-16 mb-4" />
    <p className="text-lg text-center max-w-md">{message}</p>
  </div>
);

export default ErrorState;

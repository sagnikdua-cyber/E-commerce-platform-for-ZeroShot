import { PackageX } from 'lucide-react';

const EmptyState = ({ message = "No items found." }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <PackageX className="w-16 h-16 mb-4 text-gray-400" />
    <p className="text-lg">{message}</p>
  </div>
);

export default EmptyState;

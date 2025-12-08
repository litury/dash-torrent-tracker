import React from 'react';

export default function ProfileChip({ address }) {
  if (!address || typeof address !== 'string') {
    return null;
  }

  const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;

  return (
    <div
      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full py-1.5 px-3"
      aria-label={`Connected account: ${address}`}
      title={address}
    >
      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
      <span className="text-sm font-mono font-medium">{truncatedAddress}</span>
    </div>
  );
}

import React from 'react';

export const HeaderBar: React.FC = () => {
  return (
    <div className="w-100 bg-layer--1 text-primary-text flex gap-4 p-4">
      <div className="flex-grow"></div>
      <div className="flex-none">
        <button className="bg-primary text-primary-text rounded-lg px-4 py-2">
          Placeholder
        </button>
      </div>
    </div>
  );
};

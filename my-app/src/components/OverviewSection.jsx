import React from 'react';

const OverviewSection = ({ title, description }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default OverviewSection;


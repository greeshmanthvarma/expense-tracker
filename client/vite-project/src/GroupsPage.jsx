import React from 'react';

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
        <button className="bg-notion-gray-3 text-white px-4 py-2 rounded-lg hover:bg-notion-gray-2 transition-colors">
          Create Group
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-medium mb-2">No groups yet</h3>
          <p className="text-gray-400">Create groups to manage shared expenses with multiple people</p>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';

export default function FriendRequests({ receivedRequests, sentRequests, renderUserCard }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-700">Received Requests ({receivedRequests.length})</h2>
        {receivedRequests.length > 0 ? (
          receivedRequests.map(req => renderUserCard({ ...req.sender, request_id: req.id }, 'received'))
        ) : (
          <p className="text-gray-500">No new friend requests.</p>
        )}
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-700">Sent Requests ({sentRequests.length})</h2>
        {sentRequests.length > 0 ? (
          sentRequests.map(req => renderUserCard({ ...req.receiver, request_id: req.id }, 'sent'))
        ) : (
          <p className="text-gray-500">You haven't sent any requests.</p>
        )}
      </div>
    </div>
  );
}
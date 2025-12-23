import React from 'react';

export default function FriendRequests({ receivedRequests, sentRequests, renderUserCard }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto">
      <div className="space-y-3 overflow-y-auto h-auto max-w-2xl">
        <h2 className="text-xl font-semibold text-white">Received Requests ({receivedRequests.length})</h2>
        {receivedRequests.length > 0 ? (
          receivedRequests.map(req => renderUserCard({ ...req.sender, request_id: req.id }, 'received'))
        ) : (
          <p className="text-white">No new friend requests.</p>
        )}
      </div>
      <div className="space-y-3 overflow-y-auto h-auto max-w-2xl">
        <h2 className="text-xl font-semibold text-white">Sent Requests ({sentRequests.length})</h2>
        {sentRequests.length > 0 ? (
          sentRequests.map(req => renderUserCard({ ...req.receiver, request_id: req.id }, 'sent'))
        ) : (
          <p className="text-white">You haven't sent any requests.</p>
        )}
      </div>
    </div>
  );
}
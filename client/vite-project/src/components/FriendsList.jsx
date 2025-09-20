import React from 'react';

export default function FriendsList({ friends, renderUserCard }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-700">Your Friends</h2>
      {friends.length > 0 ? (
        friends.map(friend => renderUserCard(friend, 'friend'))
      ) : (
        <p className="text-gray-500">You have no friends yet. Add some from the "Add Friend" tab!</p>
      )}
    </div>
  );
}
import React from 'react';

export default function FriendsList({ friends, renderUserCard }) {
  return (
    <div className="space-y-3 overflow-y-auto h-auto">
      <h2 className="text-xl font-semibold text-white">Your Friends</h2>
      {friends.length > 0 ? (
        friends.map(friend => renderUserCard(friend, 'friend'))
      ) : (
        <p className="text-white">You have no friends yet. Add some from the "Add Friend" tab!</p>
      )}
    </div>
  );
}
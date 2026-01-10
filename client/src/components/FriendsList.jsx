import React from 'react';

export default function FriendsList({ friends, renderUserCard }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-black dark:text-white">Your Friends</h2>
      {friends.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {friends.map(friend => renderUserCard(friend, 'friend'))}
        </div>
      ) : (
        <p className="text-black dark:text-white">You have no friends yet. Add some from the "Add Friend" tab!</p>
      )}
    </div>
  );
}
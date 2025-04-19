'use client';

import GroupList from '@/components/GroupList';
import { useState, useEffect } from 'react';

export default function Home() {
  const [groups, setGroups] = useState([
    { id: '1', name: 'Technology Enthusiasts', description: 'A group for discussing the latest in tech.' },
    { id: '2', name: 'Book Club', description: 'Share and discuss your favorite books.' },
    { id: '3', name: 'Travel Adventures', description: 'Plan and share your travel experiences.' },
  ]);

  const [joinedGroups, setJoinedGroups] = useState([]);

  useEffect(() => {
    const storedJoinedGroups = localStorage.getItem('joinedGroups');
    if (storedJoinedGroups) {
      setJoinedGroups(JSON.parse(storedJoinedGroups));
    }
  }, []);

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroups(prev => {
      const newGroups = [...prev, groupId];
      localStorage.setItem('joinedGroups', JSON.stringify(newGroups));
      return newGroups;
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    setJoinedGroups(prev => {
      const newGroups = prev.filter(id => id !== groupId);
      localStorage.setItem('joinedGroups', JSON.stringify(newGroups));
      return newGroups;
    });
  };

  const isGroupJoined = (groupId: string) => joinedGroups.includes(groupId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12">
      <h1 className="text-3xl font-bold mb-6 text-center">AnonTalk</h1>
      <GroupList
        groups={groups}
        joinedGroups={joinedGroups}
        onJoinGroup={handleJoinGroup}
        onLeaveGroup={handleLeaveGroup}
        isGroupJoined={isGroupJoined}
      />
    </main>
  );
}


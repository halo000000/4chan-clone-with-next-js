'use client';

import React from 'react';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

interface GroupType {
  id: string;
  name: string;
  description: string;
}

interface GroupListProps {
  groups: GroupType[];
  joinedGroups: string[];
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  isGroupJoined: (groupId: string) => boolean;
}

const GroupList: React.FC<GroupListProps> = ({groups, joinedGroups, onJoinGroup, onLeaveGroup, isGroupJoined}) => {
  const router = useRouter();

  const handleGroupClick = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Explore Groups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold">{group.name}</h3>
            <p className="text-gray-600">{group.description}</p>
            {isGroupJoined(group.id) ? (
              <>
                <Button variant="secondary" onClick={() => onLeaveGroup(group.id)}>
                  Leave Group
                </Button>
                <Button onClick={() => handleGroupClick(group.id)}>View Posts</Button>
              </>
            ) : (
              <Button onClick={() => onJoinGroup(group.id)}>Join Group</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;

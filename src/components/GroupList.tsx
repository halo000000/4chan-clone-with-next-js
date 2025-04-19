'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Thread from './Thread';
import { v4 as uuidv4 } from 'uuid';

interface GroupType {
  id: string;
  name: string;
  description: string;
}

interface ThreadType {
  id: string;
  groupId: string;
  title: string;
  content: string;
  image?: string | null;
  replies: ReplyType[];
}

interface ReplyType {
  id: string;
  content: string;
}

interface GroupListProps {
  groups: GroupType[];
  joinedGroups: string[];
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  isGroupJoined: (groupId: string) => boolean;
}

const GroupList: React.FC<GroupListProps> = ({ groups, joinedGroups, onJoinGroup, onLeaveGroup, isGroupJoined }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadType[]>([]);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');
    const [newThreadImage, setNewThreadImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const storedThreads = localStorage.getItem('threads');
    if (storedThreads) {
      setThreads(JSON.parse(storedThreads));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('threads', JSON.stringify(threads));
  }, [threads]);

  const handleGroupClick = (groupId: string) => {
    setSelectedGroup(groupId);
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            setNewThreadImage(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setNewThreadImage(null);
            setPreviewImage(null);
        }
    };


    const handleCreateThread = () => {
        if (selectedGroup && newThreadTitle && newThreadContent) {
            const newThread: ThreadType = {
                id: uuidv4(),
                groupId: selectedGroup,
                title: newThreadTitle,
                content: newThreadContent,
                image: previewImage,
                replies: [],
            };
            setThreads([...threads, newThread]);
            setNewThreadTitle('');
            setNewThreadContent('');
            setNewThreadImage(null);
            setPreviewImage(null);
        }
    };

  const handleAddReply = (threadId: string, replyContent: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId
          ? { ...thread, replies: [...thread.replies, { id: uuidv4(), content: replyContent }] }
          : thread
      )
    );
  };

  const handleDeleteThread = (threadId: string) => {
    setThreads((prevThreads) => prevThreads.filter((thread) => thread.id !== threadId));
  };

  const handleDeleteReply = (threadId: string, replyId: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId
          ? { ...thread, replies: thread.replies.filter((reply) => reply.id !== replyId) }
          : thread
      )
    );
  };

  const filteredThreads = selectedGroup ? threads.filter(thread => thread.groupId === selectedGroup) : [];

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

      {selectedGroup && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Posts in {groups.find(group => group.id === selectedGroup)?.name}</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Thread Title"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    className="w-full p-2 border rounded shadow-sm"
                />
                <textarea
                    placeholder="Thread Content"
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    className="w-full p-2 border rounded shadow-sm mt-2"
                />
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 w-full"
                />
                {previewImage && (
                    <img src={previewImage} alt="Preview" className="mt-2 rounded max-h-48 object-contain" />
                )}

                <Button onClick={handleCreateThread} className="mt-2">Create Thread</Button>
            </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredThreads.map((thread) => (
              <Thread
                key={thread.id}
                thread={thread}
                onAddReply={handleAddReply}
                onDeleteThread={handleDeleteThread}
                onDeleteReply={handleDeleteReply}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupList;

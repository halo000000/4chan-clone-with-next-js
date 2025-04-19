
'use client';

import React, { useState } from 'react';
import Thread from './Thread';
import NewThreadForm from './NewThreadForm';
import { v4 as uuidv4 } from 'uuid';

interface ThreadType {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  replies: ReplyType[];
}

interface ReplyType {
  id: string;
  content: string;
}

const Board = () => {
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  const handleCreateThread = (title: string, content: string, image: string | null) => {
    const newThread: ThreadType = {
      id: uuidv4(),
      title,
      content,
      image,
      replies: [],
    };
    setThreads([...threads, newThread]);
    setShowNewThreadForm(false);
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Board</h2>
        <button
          className="bg-primary text-white rounded px-4 py-2 hover:bg-primary/80 transition-colors"
          onClick={() => setShowNewThreadForm(true)}
        >
          Create Thread
        </button>
      </div>

      {showNewThreadForm && (
        <NewThreadForm onCreateThread={handleCreateThread} onClose={() => setShowNewThreadForm(false)} />
      )}

      <div className="grid grid-cols-1 gap-4">
        {threads.map((thread) => (
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
  );
};

export default Board;

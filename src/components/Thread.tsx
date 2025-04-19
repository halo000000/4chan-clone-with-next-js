
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ThreadProps {
  thread: {
    id: string;
    title: string;
    content: string;
    image?: string | null;
    replies: { id: string; content: string }[];
  };
  onAddReply: (threadId: string, replyContent: string) => void;
  onDeleteThread: (threadId: string) => void;
  onDeleteReply: (threadId: string, replyId: string) => void;
}

const Thread: React.FC<ThreadProps> = ({ thread, onAddReply, onDeleteThread, onDeleteReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showFullContent, setShowFullContent] = useState(false);

  const handleAddReply = () => {
    if (replyContent) {
      onAddReply(thread.id, replyContent);
      setReplyContent('');
    }
  };

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const shortContent = thread.content.length > 200 && !showFullContent
    ? thread.content.substring(0, 200) + '...'
    : thread.content;

  return (
    <div className="bg-card rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{thread.title}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDeleteThread(thread.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {thread.image && (
        <img src={thread.image} alt="Thread Image" className="mt-2 rounded max-h-48 object-contain" />
      )}
      <p className="mt-2">{shortContent}</p>
      {thread.content.length > 200 && (
        <button className="text-primary text-sm hover:underline" onClick={toggleContent}>
          {showFullContent ? 'Show Less' : 'Show More'}
        </button>
      )}
      <div className="mt-4">
        <h4 className="text-lg font-semibold">Replies</h4>
        {thread.replies.map((reply) => (
          <div key={reply.id} className="mb-2 p-2 rounded-md bg-muted">
            <div className="flex justify-between items-center">
              <p>{reply.content}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDeleteReply(thread.id, reply.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Reply
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        <div className="mt-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Add a reply..."
            className="w-full rounded-md"
          />
          <Button onClick={handleAddReply} className="mt-2">
            Add Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Thread;

'use client';

import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import Thread from './Thread';
import {v4 as uuidv4} from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from 'next/navigation';

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

interface GroupPageProps {
  group: GroupType;
}

const GroupPage: React.FC<GroupPageProps> = ({group}) => {
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadImage, setNewThreadImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false)
  const router = useRouter();

  useEffect(() => {
    const storedThreads = localStorage.getItem(`threads-${group.id}`);
    if (storedThreads) {
      setThreads(JSON.parse(storedThreads));
    }
  }, [group.id]);

  useEffect(() => {
    localStorage.setItem(`threads-${group.id}`, JSON.stringify(threads));
  }, [threads, group.id]);

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
    if (newThreadTitle && newThreadContent) {
      const newThread: ThreadType = {
        id: uuidv4(),
        groupId: group.id,
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
      setOpen(false)
    }
  };

  const handleAddReply = (threadId: string, replyContent: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId
          ? {...thread, replies: [...thread.replies, {id: uuidv4(), content: replyContent}]}
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
          ? {...thread, replies: thread.replies.filter((reply) => reply.id !== replyId)}
          : thread
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => router.push('/groups')}>
        Back to Groups
      </Button>
      <h2 className="text-2xl font-bold mb-4">Posts in {group.name}</h2>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Post</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Add a title, content, and an optional image to share with the group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium leading-none text-foreground">
                Title
              </label>
              <div className="col-span-3">
                <Input
                  type="text"
                  id="title"
                  placeholder="Post Title"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="content" className="text-right text-sm font-medium leading-none text-foreground">
                Content
              </label>
              <div className="col-span-3">
                <Textarea
                  id="content"
                  placeholder="Post Content"
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="image" className="text-right text-sm font-medium leading-none text-foreground">
                Image
              </label>
              <div className="col-span-3">
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {previewImage && (
                  <img src={previewImage} alt="Preview" className="mt-2 rounded max-h-48 object-contain"/>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handleCreateThread}>
              Create Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-4 mt-4">
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

export default GroupPage;

    

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NewThreadFormProps {
  onCreateThread: (title: string, content: string, image: string | null) => void;
  onClose: () => void;
}

const NewThreadForm: React.FC<NewThreadFormProps> = ({ onCreateThread, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreviewImage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onCreateThread(title, content, previewImage);
      setTitle('');
      setContent('');
      setImage(null);
      setPreviewImage(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background bg-opacity-75 flex justify-center items-center">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Thread</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-foreground">
              Image (Optional)
            </label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 w-full"
            />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 rounded max-h-48 object-contain" />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Thread</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewThreadForm;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import Navbar from '@/components/layout/Navbar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Download, File, FileText, Image, Paperclip, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isFile?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTaskById } = useTasks();
  
  const task = getTaskById(id!);
  
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How is the task going?',
      senderId: 'client123',
      senderName: 'Client',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      text: 'I\'m making good progress. Should be done on time.',
      senderId: user?.id || 'responder123',
      senderName: user?.firstName || 'You',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000) // 1.5 hours ago
    },
    {
      id: '3',
      text: 'Great! Do you need any additional information from me?',
      senderId: 'client123',
      senderName: 'Client',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    },
    {
      id: '4',
      text: 'project-requirements.pdf',
      senderId: 'client123',
      senderName: 'Client',
      timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
      isFile: true,
      fileName: 'project-requirements.pdf',
      fileUrl: 'https://source.unsplash.com/random/800x600/?document',
      fileType: 'pdf'
    },
    {
      id: '5',
      text: 'Here\'s the mockup image',
      senderId: 'client123',
      senderName: 'Client',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      isFile: true,
      fileName: 'mockup.jpg',
      fileUrl: 'https://source.unsplash.com/random/800x600/?design',
      fileType: 'image'
    }
  ]);
  
  if (!task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Task Not Found</h1>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageText.trim() === '') return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      text: messageText,
      senderId: user?.id || 'responder123',
      senderName: user?.firstName || 'You',
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = getFileType(file.type);
      
      // Create a temporary URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        text: file.name,
        senderId: user?.id || 'responder123',
        senderName: user?.firstName || 'You',
        timestamp: new Date(),
        isFile: true,
        fileName: file.name,
        fileUrl: fileUrl,
        fileType: fileType
      };
      
      setMessages([...messages, newMessage]);
    }
  };
  
  // Get file type from MIME type
  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    return 'file';
  };
  
  // Format message time
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render file preview based on file type
  const renderFilePreview = (message: Message) => {
    if (!message.fileUrl) return null;
    
    // For image files
    if (message.fileType === 'image') {
      return (
        <div className="mt-2 relative rounded-md overflow-hidden">
          <AspectRatio ratio={16 / 9} className="bg-gray-100">
            <img 
              src={message.fileUrl} 
              alt={message.fileName} 
              className="object-cover w-full h-full rounded-md"
            />
          </AspectRatio>
          <div className="absolute bottom-2 right-2">
            <a 
              href={message.fileUrl} 
              download={message.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 bg-white/90 rounded-full hover:bg-white"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
        </div>
      );
    }
    
    // For PDF files
    if (message.fileType === 'pdf') {
      return (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gray-50">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-sm font-medium truncate max-w-[200px]">
                {message.fileName}
              </span>
            </div>
            <a 
              href={message.fileUrl} 
              download={message.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
          <div className="p-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.open(message.fileUrl, '_blank')}
            >
              View Document
            </Button>
          </div>
        </div>
      );
    }
    
    // Default file preview
    return (
      <div className="mt-2 border rounded-md overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-gray-50">
          <div className="flex items-center">
            <File className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {message.fileName}
            </span>
          </div>
          <a 
            href={message.fileUrl} 
            download={message.fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              Back
            </Button>
            <span className="text-lg font-semibold">{task.title}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/task/${task.id}`)}
          >
            View Task
          </Button>
        </div>
        
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b bg-gray-50 py-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2">
                C
              </div>
              <div>
                <h3 className="text-sm font-medium">Client</h3>
                <p className="text-xs text-gray-500">Task Owner</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id || message.senderId === 'responder123' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      message.senderId === user?.id || message.senderId === 'responder123'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.isFile ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4" />
                          <span>{message.fileName}</span>
                        </div>
                        {renderFilePreview(message)}
                      </>
                    ) : (
                      <p>{message.text}</p>
                    )}
                    <div
                      className={`text-xs mt-1 ${
                        message.senderId === user?.id || message.senderId === 'responder123'
                          ? 'text-white/70'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <Button type="submit" size="icon" className="h-10 w-10 rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;

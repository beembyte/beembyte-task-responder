import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import useTask from '@/hooks/useTask';
import Navbar from '@/components/layout/Navbar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Download, File, FileText, Upload, Paperclip, Send, ArrowLeft, Hash, Users, Settings, MessageSquare, X } from 'lucide-react';
import { toast } from 'sonner';

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

interface PendingFile {
  file: File;
  preview?: string;
  type: string;
}

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { verifyAuthToken } = useAuth();
  const { getOneTaskById } = useTask();

  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [taskNotFound, setTaskNotFound] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How is the task going?',
      senderId: 'client123',
      senderName: 'Client',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      text: 'I\'m making good progress. Should be done on time.',
      senderId: 'responder123',
      senderName: 'You',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    },
    {
      id: '3',
      text: 'Great! Do you need any additional information from me?',
      senderId: 'client123',
      senderName: 'Client',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ]);

  // Verify auth token on component mount
  useEffect(() => {
    verifyAuthToken()
  }, [verifyAuthToken])

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        setIsLoading(true)
        setTaskNotFound(false)
        const response = await getOneTaskById(id)
        if (response.success && response.data) {
          setTask(response.data)
          setTaskNotFound(false)
        } else {
          setTask(null)
          setTaskNotFound(true)
          if (response.message) {
            toast.error(response.message)
          }
        }
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [id])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [messageText])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xl text-gray-600">Loading chat...</span>
          </div>
        </div>
      </div>
    )
  }

  if (taskNotFound || !task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Task Not Found</h1>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  const isValidFileType = (file: File): boolean => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/csv',
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    ];

    return allowedTypes.includes(file.type) || file.name.toLowerCase().endsWith('.csv');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (messageText.trim() === '' && pendingFiles.length === 0) return;

    // Send text message if there's text
    if (messageText.trim() !== '') {
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        text: messageText,
        senderId: 'responder123',
        senderName: 'You',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    }

    // Send file messages
    pendingFiles.forEach((pendingFile) => {
      const fileUrl = URL.createObjectURL(pendingFile.file);
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        text: pendingFile.file.name,
        senderId: 'responder123',
        senderName: 'You',
        timestamp: new Date(),
        isFile: true,
        fileName: pendingFile.file.name,
        fileUrl: fileUrl,
        fileType: pendingFile.type
      };
      setMessages(prev => [...prev, newMessage]);
    });

    setMessageText('');
    setPendingFiles([]);
    toast.success("Message sent successfully!");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      files.forEach(file => {
        if (!isValidFileType(file)) {
          toast.error(`${file.name} is not a supported file type. Please upload images, PDF, DOCX, or CSV files only.`);
          return;
        }

        const fileType = getFileType(file.type);
        const pendingFile: PendingFile = {
          file,
          type: fileType
        };

        // Create preview for images
        if (fileType === 'image') {
          const reader = new FileReader();
          reader.onload = (e) => {
            pendingFile.preview = e.target?.result as string;
            setPendingFiles(prev => [...prev, pendingFile]);
          };
          reader.readAsDataURL(file);
        } else {
          setPendingFiles(prev => [...prev, pendingFile]);
        }
      });
    }

    // Reset the input
    e.target.value = '';
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
    return 'file';
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFilePreview = (message: Message) => {
    if (!message.fileUrl) return null;

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

  const renderPendingFilePreview = (pendingFile: PendingFile, index: number) => {
    if (pendingFile.type === 'image' && pendingFile.preview) {
      return (
        <div key={index} className="relative inline-block mr-2 mb-2">
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={pendingFile.preview}
              alt={pendingFile.file.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => removePendingFile(index)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
            {pendingFile.file.name}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="relative inline-block mr-2 mb-2">
        <div className="w-20 h-20 rounded-lg border-2 border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-2">
          {pendingFile.type === 'pdf' && <FileText className="w-6 h-6 text-red-500" />}
          {pendingFile.type === 'document' && <FileText className="w-6 h-6 text-blue-500" />}
          {(pendingFile.type === 'spreadsheet' || pendingFile.file.name.toLowerCase().endsWith('.csv')) && <File className="w-6 h-6 text-green-500" />}
          {pendingFile.type === 'file' && <File className="w-6 h-6 text-gray-500" />}
          <span className="text-xs text-center mt-1 truncate w-full">
            {pendingFile.file.name.split('.').pop()?.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => removePendingFile(index)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-200 bg-white shadow-sm flex items-center px-4 gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="flex-shrink-0 h-8 w-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Hash className="h-5 w-5 text-gray-500" />

          <div className="flex-1">
            <h1 className="font-semibold text-base truncate text-gray-900">{task.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="p-4">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'responder123' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${message.senderId === 'responder123'
                          ? 'bg-primary text-primary-foreground'
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
                          className={`text-xs mt-1 ${message.senderId === 'responder123'
                            ? 'text-primary-foreground/70'
                            : 'text-gray-500'
                            }`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full p-6 inline-flex mb-4">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Start the conversation</h3>
                    <p className="text-gray-600 max-w-sm text-sm">
                      This is the beginning of your conversation about "{task.title}".
                      Send your first message to get started!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {/* Pending Files Preview */}
            {pendingFiles.length > 0 && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Files to send:</span>
                </div>
                <div className="flex flex-wrap">
                  {pendingFiles.map((pendingFile, index) =>
                    renderPendingFilePreview(pendingFile, index)
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message ${task.created_by ? `${task.created_by.first_name}` : 'client'}...`}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <div className="flex items-center space-x-2">
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="h-9 w-9 rounded-md bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <Paperclip className="h-4 w-4 text-gray-600" />
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.csv,.xls,.xlsx"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                  disabled={!messageText.trim() && pendingFiles.length === 0}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Task Details */}
      <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
        {/* Client Info */}
        {task.created_by && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://robohash.org/${encodeURIComponent(task.created_by.first_name)}?set=set4&size=200x200`}
                  alt={task.created_by.first_name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {task.created_by.first_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {task.created_by.first_name} {task.created_by.last_name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-500">About Me</span>
                <p className="text-gray-700 mt-1">Ready to help with your tasks efficiently and professionally.</p>
              </div>
              <div>
                <span className="text-gray-500">Member Since</span>
                <p className="text-gray-700 mt-1">Jan 15, 2024</p>
              </div>
            </div>
          </div>
        )}

        {/* Task Details */}
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Task Details</h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-500 block mb-1">Title</span>
              <p className="text-gray-900">{task.title}</p>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Subject</span>
              <p className="text-gray-700">{task.subject}</p>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Description</span>
              <p className="text-gray-700 text-xs leading-relaxed">{task.description}</p>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Price</span>
              <p className="text-green-600 font-medium">₦{task.price?.toLocaleString()}</p>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Status</span>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${task.status === 'INPROGRESS' ? 'bg-blue-100 text-blue-700' :
                task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                {task.status === 'INPROGRESS' ? 'IN PROGRESS' : task.status}
              </span>
            </div>

            <div>
              <span className="text-gray-500 block mb-1">Created</span>
              <p className="text-gray-700">{new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <Button
            onClick={() => navigate(`/task/${id}`)}
            variant="outline"
            className="w-full mt-4 text-xs h-8"
          >
            View Full Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

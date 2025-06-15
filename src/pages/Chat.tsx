import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { socket } from '@/services/socket';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import {
  USER_STATUS,
  USER_ROLES,
  TASK_DIFFICULTY,
  ASSIGNED_STATUS,
  USER_FINAL_DECISION,
  TASK_STATUS,
  RESPONDER_FINAL_DECISION,
  User,
  TaskInfo,
} from "@/types";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { MoreHorizontal } from "lucide-react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageList, { Message } from "@/components/chat/ChatMessageList";
import ChatInputBox from "@/components/chat/ChatInputBox";

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { loggedInUser } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [recipient, setRecipient] = useState({
    name: 'Client',
    avatar: 'https://robohash.org/client.png?set=set4',
    isOnline: false,
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [task, setTask] = useState<TaskInfo | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await loggedInUser();
      setUser(userData);
    };
    fetchUser();
  }, [loggedInUser]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Connect to socket and load chat history
    if (id) {
      // Mock data for demonstration
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Hello! I need help with my task.',
          sender: 'client',
          timestamp: new Date(Date.now() - 3600000),
          isRead: true,
        },
        {
          id: '2',
          text: 'Sure, I can help. What specifically do you need assistance with?',
          sender: 'responder',
          timestamp: new Date(Date.now() - 3500000),
          isRead: true,
        },
        {
          id: '3',
          text: 'I need help understanding the requirements better.',
          sender: 'client',
          timestamp: new Date(Date.now() - 3400000),
          isRead: true,
        },
        {
          id: '4',
          text: 'Let me check the task details and get back to you.',
          sender: 'responder',
          timestamp: new Date(Date.now() - 3300000),
          isRead: true,
        },
      ];
      setMessages(mockMessages);
      socket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });
      return () => {
        socket.off('new_message');
      };
    }
  }, [id]);

  useEffect(() => {
    // Demo task info fetch (replace with real fetch in your project)
    setTask({
      _id: id || "id",
      title: "Sample Task Title", // required
      subject: "Sample Subject",
      description: "A sample description for the mock task.",
      deadline: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
      price: 15000,
      created_by: {
        first_name: "Jane",
        last_name: "Doe",
        status: USER_STATUS.ACTIVE, // Fixed: use enum
        is_verified: true,
        email: "jane@client.com",
        phone_number: "08061234567",
        tasks_count: 5,
        password: "",
        role: USER_ROLES.USER, // Fixed: use enum
        last_login: new Date(),
      },
      file_urls: [],
      key_notes: [],
      difficulty: TASK_DIFFICULTY.EASY, // Fixed: use enum
      assigned_status: ASSIGNED_STATUS.ASSIGNED, // Fixed: use enum
      user_final_decision: USER_FINAL_DECISION.APPROVED, // Fixed: use enum
      status: TASK_STATUS.INPROGRESS, // Fixed: use enum
      responder_final_decision: RESPONDER_FINAL_DECISION.FINISHED, // Fixed: use enum
      progress_percentage: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      responder: undefined,
      files: [],
      submit: undefined,
    });
  }, [id, loggedInUser]);

  // --- Sidebar open/close helpers ---
  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'responder',
      timestamp: new Date(),
      isRead: false,
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    socket.emit('send_message', {
      chat_id: id,
      message: newMessage,
      sender_id: user?._id,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = (files: FileList) => {
    // Here, you could handle uploading files etc, now just show toast
    if (files.length > 0) {
      toast({
        title: "File attached",
        description: `${files[0].name} ready to send`,
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Responsive: show sidebar always on desktop, toggle on mobile
  const isDesktop = !isMobile;

  // --- Layout ---
  return (
    <div className="h-[100dvh] md:h-screen w-full bg-gray-100 flex justify-center items-stretch">
      {/* "Box" shadowed wide container, flex with 2 sides */}
      <div className="flex flex-col md:flex-row bg-white w-full md:w-4/5 max-w-5xl h-full rounded-none md:rounded-xl shadow-lg overflow-hidden border">
        
        {/* --- Left: Chat Panel (always visible) --- */}
        <div className={`
          flex-1 flex flex-col h-full relative transition-transform
          ${isMobile && showSidebar ? '-translate-x-full absolute inset-0 z-10 bg-white' : 'relative'}
        `}>
          {/* --- Chat Header --- */}
          <ChatHeader
            recipient={recipient}
            user={user}
            onBack={goBack}
            onSidebarOpen={isMobile ? openSidebar : undefined}
            isMobile={isMobile}
            taskId={id}
          />
          {/* --- Messages Area --- */}
          <ChatMessageList
            messages={messages}
            user={user}
            recipient={recipient}
          />
          {/* --- Input Area --- */}
          <ChatInputBox
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
            onAttachFile={handleAttachFile}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        {/* --- Right: Sidebar (info) --- */}
        <div className={`
          hidden md:block h-full
          bg-white border-l
        `} style={{ minWidth: 320, maxWidth: 400 }}>
          <ChatSidebar
            task={task}
            client={task?.created_by || null}
            onChat={closeSidebar}
            isTaskAccepted={true}
          />
        </div>
        {/* --- Mobile Sidebar Drawer --- */}
        {isMobile && showSidebar && (
          <div className="fixed inset-0 z-20 bg-white flex flex-col h-full w-full animate-in slide-in-from-right-32 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <div className="font-medium text-base">Task Info</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSidebar}
                aria-label="Close Info"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatSidebar
                task={task}
                client={task?.created_by || null}
                onChat={closeSidebar}
                isTaskAccepted={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

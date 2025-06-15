import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Paperclip, Image, File, X } from 'lucide-react';
import { socket } from '@/services/socket';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isRead: boolean;
}

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
      
      // Listen for new messages
      socket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });
      
      return () => {
        socket.off('new_message');
      };
    }
  }, [id]);

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
    
    // Emit message to socket
    socket.emit('send_message', {
      chat_id: id,
      message: newMessage,
      sender_id: user?.user_id,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle file upload
      toast({
        title: "File attached",
        description: `${files[0].name} ready to send`,
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-white md:rounded-lg overflow-hidden shadow md:w-3/5 mx-auto border md:mt-8 transition-all duration-300
      w-full max-w-full px-0 md:px-6">
      {/* Chat Header */}
      <div className="flex items-center px-4 py-3 border-b bg-gray-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={recipient.avatar} alt={recipient.name} />
          <AvatarFallback>
            {recipient.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="ml-3 flex-1">
          <div className="font-medium">{recipient.name}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <span className={`w-2 h-2 rounded-full mr-1 ${recipient.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            {recipient.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Task #{id}
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 md:px-4 md:py-5 bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex mb-4 ${message.sender === 'responder' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== 'responder' && (
              <Avatar className="h-8 w-8 mt-1 mr-2">
                <AvatarImage src={recipient.avatar} alt={recipient.name} />
                <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            
            <div 
              className={`max-w-[75%] px-4 py-2 rounded-lg ${
                message.sender === 'responder' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border text-gray-800'
              }`}
            >
              <div>{message.text}</div>
              <div className={`text-xs mt-1 ${message.sender === 'responder' ? 'text-blue-100' : 'text-gray-500'}`}>
                {format(new Date(message.timestamp), 'h:mm a')}
              </div>
            </div>
            
            {message.sender === 'responder' && (
              <Avatar className="h-8 w-8 mt-1 ml-2">
                <AvatarImage 
                  src={`https://robohash.org/${user?.first_name || 'responder'}.png?set=set4`} 
                  alt={user?.first_name || 'You'} 
                />
                <AvatarFallback>{(user?.first_name || 'Y').charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="px-2 pb-2 md:px-4 md:pb-4 border-t bg-white">
        <div className="flex items-end gap-2 mt-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10 py-3 min-h-[50px]"
              multiline="true"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 bottom-1/2 transform translate-y-1/2"
              onClick={handleAttachFile}
            >
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="h-10 w-10 rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

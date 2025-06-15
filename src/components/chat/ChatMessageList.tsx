
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { format } from "date-fns";
import { User } from "@/types";

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatMessageListProps {
  messages: Message[];
  user?: User | null;
  recipient: { name: string; avatar: string; isOnline: boolean };
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, user, recipient }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-blue-50 rounded-full p-4 mb-2">
            <Send className="w-9 h-9 text-blue-500" />
          </div>
          <div className="text-lg font-semibold text-gray-700 mb-1">
            No messages yet
          </div>
          <div className="text-sm text-gray-500">Start a conversation with your client.</div>
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex mb-4 ${message.sender === 'responder' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender !== 'responder' && (
              <Avatar className="h-7 w-7 mt-1 mr-2">
                <AvatarImage src={recipient.avatar} alt={recipient.name} />
                <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`max-w-[80vw] md:max-w-md px-4 py-2 rounded-xl break-words ${message.sender === 'responder'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div className={`text-xs mt-1 ${message.sender === 'responder' ? 'text-blue-100' : 'text-gray-500'}`}>
                {format(new Date(message.timestamp), 'h:mm a')}
              </div>
            </div>
            {message.sender === 'responder' && (
              <Avatar className="h-7 w-7 mt-1 ml-2">
                <AvatarImage 
                  src={`https://robohash.org/${user?.first_name || 'responder'}.png?set=set4`} 
                  alt={user?.first_name || 'You'} 
                />
                <AvatarFallback>{(user?.first_name || 'Y').charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;


import { useEffect, useState, useCallback } from "react";
import { socket } from "@/services/socket";
import { useAuth } from "@/hooks/useAuth";
import { Message } from "@/components/chat/ChatMessageList";
import { User } from "@/types";

export function useChatMessages(chatId: string | undefined) {
  const { loggedInUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await loggedInUser();
      setUser(userData);
    };
    fetchUser();
  }, [loggedInUser]);

  // Add socket/messaging logic
  useEffect(() => {
    if (!chatId) return;

    // Demo: provide initial mock messages
    const mockMessages: Message[] = [
      {
        id: "1",
        text: "Hello! I need help with my task.",
        sender: "client",
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
      },
      {
        id: "2",
        text: "Sure, I can help. What specifically do you need assistance with?",
        sender: "responder",
        timestamp: new Date(Date.now() - 3500000),
        isRead: true,
      },
      {
        id: "3",
        text: "I need help understanding the requirements better.",
        sender: "client",
        timestamp: new Date(Date.now() - 3400000),
        isRead: true,
      },
      {
        id: "4",
        text: "Let me check the task details and get back to you.",
        sender: "responder",
        timestamp: new Date(Date.now() - 3300000),
        isRead: true,
      },
    ];
    setMessages(mockMessages);

    const onNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("new_message", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [chatId]);

  // For sending messages
  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "responder",
      timestamp: new Date(),
      isRead: false,
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    socket.emit("send_message", {
      chat_id: chatId,
      message: newMessage,
      sender_id: user?._id,
    });
  }, [newMessage, chatId, user]);

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    messages,
    setMessages,
    user,
    newMessage,
    setNewMessage,
    sendMessage,
    onKeyPress,
  };
}

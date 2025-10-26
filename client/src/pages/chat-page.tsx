import { useEffect, useState, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { UserProfile } from "@/components/chat/user-profile";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { instance } from "@/lib/config";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/loader";

export interface IConvUser {
  _id: string;
  name: string;
  profilePicture: string;
}
export interface IConversation extends Document {
  participants: {
    currentUser: IConvUser;
    otherUser: IConvUser;
  };
  lastMessage?: any;
  updatedAt: Date;
  createdAt: Date;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  message: string;
  createdAt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const [isConversationLoading, setIsConversationLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [params] = useSearchParams();
  const otheruserId = params.get("otherUser");
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

  const [currentUser, setCurrentUser] = useState<IConvUser>({
    _id: "",
    name: "",
    profilePicture: "",
  });
  const [otherUser, setOtherUser] = useState<IConvUser>({
    _id: "",
    name: "",
    profilePicture: "",
  });


  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsConversationLoading(true);
        const response = await instance.get(`${SOCKET_URL}/chat`, {
          params: {
            otherUserId: otheruserId,
          },
        });

        setCurrentUser(response.data.conversation.participants.currentUser);
        setOtherUser(response.data.conversation.participants.otherUser);
        setMessages(response.data.conversation.messages);
      } catch (error) {
        console.error("[v0] Error fetching conversation:", error);
      } finally {
        setIsConversationLoading(false);
      }
    };

    fetchConversation();
  }, [otheruserId]);

  useEffect(() => {
    console.log(SOCKET_URL);
    const socket = io(SOCKET_URL, {
      path: "/ws",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("[v0] Socket connected:", socket.id);
      setIsConnected(true);
      // Join the user's personal room
      socket.emit("join", currentUser._id);
    });

    socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected");
      setIsConnected(false);
    });

    socket.on("onlineUsers", (data: string[]) => {
      setOnlineUsers(data);
    });

    socket.on("recieveMessage", (message: Message) => {
      console.log("[v0] Message received:", message);
      setMessages((prev) => [...prev, message]);
      setOtherUserTyping(false);
    });

    socket.on("messageSent", (message: Message) => {
      console.log("[v0] Message sent:", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on("userTyping", (data: { userId: string; isTyping: boolean }) => {
      console.log(data)
      if (data.userId === otherUser._id) {
        setOtherUserTyping(data.isTyping);
      }
    });

    socket.on("error", (error: string) => {
      console.error("[v0] Socket error:", error);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [currentUser._id, otherUser._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherUserTyping]);

  const handleSendMessage = (messageText: string) => {
    if (!socketRef.current || !isConnected) {
      console.error("[v0] Socket not connected");
      return;
    }

    socketRef.current.emit("sendMessage", {
      senderId: currentUser._id,
      recieverId: otherUser._id,
      message: messageText,
    });

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
  };

  const handleTyping = () => {
    if (!socketRef.current || !isConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("userTyping", {
        userId: currentUser._id,
        isTyping: true,
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit("userTyping", {
        userId: currentUser._id,
        isTyping: false,
      });
    }, 3000);
  };

  if (isConversationLoading) {
    return <Loader />;
  }

  return (
    <div className="general-container flex h-[80vh] md:h-[86vh] custom-scrollbar">
      {/* Main Chat Container */}
      <div className="h-full w-full flex flex-col">
        {/* Header with User Profile */}
        <UserProfile
          user={otherUser}
          isOnline={onlineUsers.includes(otherUser._id)}
          isOtherUserOnline={onlineUsers.includes(otherUser._id)}
        />

        {/* Messages Area */}
        <MessageList
          messages={messages}
          currentUserId={currentUser._id}
          isTyping={otherUserTyping}
          messagesEndRef={messagesEndRef}
        />

        {/* Input Area */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}

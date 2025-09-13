// src/components/ChatBot.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { UserMessage } from "./UserMessage";
// import { Input } from "./InputBox";
// import Button from "./Button";
import { ProcessingIcon } from "./ProcessingIcon";
import { PrakritiMessage } from "./TextMessage";
import { Bot } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot" | "system";
  text: string;
}
interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const messageRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentBotMessageRef = useRef<string>(""); // for streaming

  const append = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  // update last bot message during streaming
  const updateLastBotMessage = useCallback((text: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].sender === "bot") {
          updated[i].text = text;
          break;
        }
      }
      return updated;
    });
  }, []);

  // load persisted messages from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("prakriti_chat");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load persisted chat:", e);
    }
  }, []);

  // persist messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("prakriti_chat", JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to persist chat:", e);
    }
  }, [messages]);

  // auto-scroll to bottom and focus input when messages or typing changes
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      try {
        el.scrollTop = el.scrollHeight;
      } catch (error){
        console.log("Error: ", error);
        
      }
    });
    messageRef.current?.focus();
  }, [messages, typing]);

  // WebSocket connection
// WebSocket connection
useEffect(() => {
  if (!isOpen) return;

  const token = localStorage.getItem("token"); // Retrieve JWT from localStorage
  console.log("token : ", token);
  
  const ws = new WebSocket(`ws://localhost:5000/?token=${token}`); // Include token in connection URL
  wsRef.current = ws;

  ws.onopen = () => {
    setConnected(true);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "prakriti-answer") {
        append({ sender: "bot", text: data.answer });
        setTyping(false);
        setLoading(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else if (data.type === "prakriti-answer-part") {
        currentBotMessageRef.current += data.part;
        updateLastBotMessage(currentBotMessageRef.current);
      } else if (data.type === "prakriti-answer-complete") {
        setTyping(false);
        setLoading(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else if (data.type === "error") {
        append({ sender: "system", text: `Error: ${data.error}` });
        setTyping(false);
        setLoading(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else {
        append({ sender: "system", text: "Unknown message from server." });
      }
    } catch {
      append({ sender: "system", text: "Malformed message from server." });
    }
  };

  ws.onerror = () => {
    setConnected(false);
    setTyping(false);
    setLoading(false);
    append({ sender: "system", text: "WebSocket error. Please try again." });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  ws.onclose = () => {
    setConnected(false);
  };

  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      ws.close();
    } catch (error){
      console.log("Error: ", error);
    }
    wsRef.current = null;
  };
}, [isOpen, append, updateLastBotMessage]);

  const handleSendMessage = () => {
    const messageToSend = messageRef.current?.value?.trim();
    if (!messageToSend) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      append({ sender: "system", text: "Connection not ready. Please wait..." });
      return;
    }

    append({ sender: "user", text: messageToSend });
    setLoading(true);
    setTyping(true);

    // Start a new bot message placeholder
    append({ sender: "bot", text: "" });
    currentBotMessageRef.current = "";

    wsRef.current.send(
      JSON.stringify({
        type: "prakriti-doubt",
        question: messageToSend,
      })
    );

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setTyping(false);
      append({ sender: "system", text: "Response timed out. Try again." });
    }, 20000);

    if (messageRef.current) messageRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      btnRef.current?.click();
    }
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6">
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-2xl shadow-lg flex flex-col h-full sm:h-[80vh]">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-950 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-white" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-100">Prakriti Chatbot</h2>
        </div>
        <button onClick={onClose} className="text-gray-200 hover:text-white" aria-label="Close chat">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900"
        aria-live="polite"
      >
        <div className="bg-slate-100 p-2 rounded-lg self-start text-gray-700 max-w-[80%] sm:max-w-[70%]">
          👋 Hello! I'm your Prakriti Bot.
        </div>
        <div className="bg-green-100 border border-green-400 text-green-900 p-2 rounded-lg self-end max-w-[80%] sm:max-w-[70%] ml-auto shadow">
          {connected ? "Ask anything about Prakriti and Ayurveda." : "Connecting..."}
        </div>

        {messages.map((msg, index) =>
          msg.sender === "user" ? (
            <div key={index} className="flex justify-end">
              <UserMessage message={msg.text} />
            </div>
          ) : msg.sender === "bot" ? (
            <div key={index} className="flex justify-start">
              <PrakritiMessage message={msg.text} />
            </div>
          ) : (
            <div key={index} className="flex justify-center">
              <div className="text-xs text-gray-200">{msg.text}</div>
            </div>
          )
        )}

        {typing && (
          <div className="flex items-center gap-2 pl-2 text-gray-200 animate-pulse">
            <div className="h-3 w-3 rounded-full bg-emerald-300 animate-bounce mr-1"></div>
            Bot is typing...
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-slate-950 bg-gradient-to-r from-slate-900 to-slate-900 rounded-b-2xl flex items-center gap-2">
        <input
          ref={messageRef}
          placeholder="Ask Prakriti AI"
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-2 focus:border-emerald-700"
          type="text"
        />
        <button
          ref={btnRef}
          type="button"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded transition flex items-center gap-2 disabled:opacity-60"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? <ProcessingIcon /> : null}
          Send
        </button>
      </div>
    </div>
  </div>
);
}

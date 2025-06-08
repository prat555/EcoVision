import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ChatBot from "@/icons/ChatBot";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hello! I'm EcoBot, your AI sustainability assistant. Ask me anything about waste disposal, recycling, or sustainable practices!",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest('POST', '/api/chat', { message });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        id: data.id,
        content: data.response, 
        isUser: false 
      }]);
    },
    onError: (error) => {
      toast({
        title: 'Chat Error',
        description: `Failed to get response: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive'
      });
      setMessages(prev => [...prev, { 
        id: `error-${Date.now()}`,
        content: "I'm sorry, I encountered an error processing your request. Please try again.", 
        isUser: false 
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Send to API
    chatMutation.mutate(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden mb-12 max-w-4xl mx-auto transition-colors">
      <CardHeader className="bg-primary px-6 py-4">
        <CardTitle className="text-xl font-heading font-semibold text-white flex items-center">
          <ChatBot className="h-5 w-5 mr-2" />
          EcoBot - AI Sustainability Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 h-96 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 chat-scrollbar">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start mb-4 ${message.isUser ? 'justify-end' : ''}`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                  <ChatBot className="h-5 w-5" />
                </div>
              )}
              
              <div className={`rounded-lg p-3 max-w-[75%] ${
                message.isUser 
                  ? 'bg-primary bg-opacity-10' 
                  : 'bg-neutral-100 dark:bg-neutral-700'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-600 text-white flex items-center justify-center ml-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Ask about waste disposal or sustainable practices..."
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:border-primary dark:bg-neutral-700"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={chatMutation.isPending}
          />
          <Button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-secondary transition-colors p-1 h-auto"
            variant="ghost"
            onClick={handleSendMessage}
            disabled={chatMutation.isPending || !inputValue.trim()}
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </section>
  );
}

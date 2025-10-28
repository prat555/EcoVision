import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
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
      content: "👋 Hello! I'm EcoBot, your AI sustainability assistant powered by Google Gemini. Ask me anything about waste disposal, recycling, or sustainable practices!",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

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
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
      return false;
    }
  };
  
  return (
    <section className="mb-16 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h3 className="text-3xl font-heading font-bold mb-3 flex items-center justify-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          EcoBot - AI Assistant
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get instant answers about waste management, recycling tips, and sustainable practices
        </p>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden border-2 backdrop-blur-sm bg-card/80">
        <CardHeader className="bg-gradient-to-r from-primary to-green-600 px-6 py-5">
          <CardTitle className="text-xl font-heading font-semibold text-white flex items-center gap-2">
            <ChatBot className="h-6 w-6" />
            EcoBot Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 h-[500px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}
              >
                {!message.isUser && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-green-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <ChatBot className="h-5 w-5" />
                  </div>
                )}
                
                <div className={`rounded-2xl px-5 py-3 max-w-[80%] shadow-sm ${
                  message.isUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
                
                {message.isUser && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="border-t-2 p-4 bg-card/50 backdrop-blur-sm">
            <div className="relative max-w-4xl mx-auto">
              <Input
                type="text"
                placeholder="Ask about waste disposal or sustainable practices..."
                className="w-full rounded-xl py-6 px-5 pr-14 text-sm border-2 border-border focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 shadow-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={chatMutation.isPending}
              />
              <Button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-green-700 text-white rounded-lg shadow-md h-10 w-10 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSendMessage();
                }}
                disabled={chatMutation.isPending || !inputValue.trim()}
              >
                {chatMutation.isPending ? '...' : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </section>
  );
}

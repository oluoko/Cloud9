import {
  useNavigationAI,
  BOT_CONFIGS,
  BotType,
} from "@/hooks/use-navigation-ai";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  suggestions?: Array<{
    path: string;
    label: string;
    confidence: number;
    reason: string;
  }>;
}

interface NavigationBotProps {
  botType: BotType;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const NavigationBot: React.FC<NavigationBotProps> = ({
  botType,
  isOpen,
  setIsOpen,
}) => {
  console.log("NavigationBot::", botType, "isOpen:", isOpen);
  const botConfig = BOT_CONFIGS[botType];
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: botConfig.greeting, isBot: true },
    { id: "2", text: botConfig.helpText, isBot: true },
  ]);
  const [input, setInput] = useState("");
  const { analyzeIntent, navigate } = useNavigationAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when bot type changes
  useEffect(() => {
    setMessages([
      { id: "1", text: botConfig.greeting, isBot: true },
      { id: "2", text: botConfig.helpText, isBot: true },
    ]);
  }, [botType, botConfig]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };

    const suggestions = analyzeIntent(input);
    const botResponse =
      suggestions.length > 0
        ? "I found these pages that might help:"
        : "I couldn't find specific matches. Here are some popular sections:";

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isBot: true,
      suggestions:
        suggestions.length > 0
          ? suggestions
          : [
              {
                path: "/",
                label: "Home",
                confidence: 0.5,
                reason: "Main page",
              },
              {
                path: "/flights",
                label: "Find and book a flight",
                confidence: 0.5,
                reason: "Main functionality",
              },
            ],
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const handleSuggestionClick = (path: string) => {
    navigate(path);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Great! Taking you to ${path}`,
        isBot: true,
      },
    ]);
    setTimeout(() => setIsOpen(false), 1000);
  };

  if (!isOpen) return null;

  console.log("Bot::", botType, "Messages:", messages);

  return (
    <div className="fixed bottom-[90px] md:bottom-[110px] right-4 md:right-6 w-80 h-96 bg-background rounded-lg shadow-xl border z-50 flex flex-col">
      <div className="p-3 bg-primary rounded-t-lg">
        <h3 className="font-semibold text-black">
          {botConfig.name}: {botConfig.title}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg ${
                msg.isBot ? "bg-accent" : "bg-primary text-background"
              }`}
            >
              {msg.text}
              {msg.suggestions && (
                <div className="mt-2 space-y-1">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion.path)}
                      className="block w-full text-left p-2 text-background bg-primary hover:bg-primary/80 rounded text-sm border transition-colors"
                    >
                      <div className="font-medium">{suggestion.label}</div>
                      <div className="text-xs text-gray-600">
                        {suggestion.reason}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="What are you looking for?"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/80 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

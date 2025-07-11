import {
  useNavigationAI,
  BOT_CONFIGS,
  BotType,
} from "@/hooks/use-navigation-ai";
import React, { useState, useRef, useEffect } from "react";
import { useMe } from "@/contexts/use-user";

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
  isContextual?: boolean;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
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
  const botConfig = BOT_CONFIGS[botType];
  const { me } = useMe();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: botConfig.greeting, isBot: true },
    { id: "2", text: botConfig.helpText, isBot: true },
  ]);
  const [input, setInput] = useState("");
  const { analyzeIntent, navigate, context } = useNavigationAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when bot type changes
  useEffect(() => {
    const welcomeMessage =
      context.isAuthenticated && me
        ? `${botConfig.greeting} Welcome back, ${me.firstName || "there"}!`
        : botConfig.greeting;

    setMessages([
      { id: "1", text: welcomeMessage, isBot: true },
      { id: "2", text: botConfig.helpText, isBot: true },
    ]);
  }, [botType, botConfig, context.isAuthenticated, me]);

  const [isLoading, setIsLoading] = useState(false);

  const generateBotResponse = async (
    query: string,
    analysisResult: any
  ): Promise<string> => {
    const { suggestions, contextualResponse, requiresAuth, requiresAdmin } =
      analysisResult;

    // Handle contextual responses
    if (contextualResponse) {
      return contextualResponse;
    }

    // Handle authentication requirements
    if (requiresAuth) {
      const authResponse =
        botType === "CloudIA"
          ? "Oops! You'll need to log in first to access that feature. I can help you get signed in! 🔐"
          : "You need to be logged in to access that feature. Would you like to sign in?";
      return authResponse;
    }

    // Handle admin requirements
    if (requiresAdmin) {
      const adminResponse =
        botType === "CloudIA"
          ? "Sorry, that's an admin-only feature! You'll need administrator privileges to access those tools. 👩‍💼"
          : "That feature requires administrator privileges. Only admin users can access those functions.";
      return adminResponse;
    }

    // Try to get AI response
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          botType,
          context,
          suggestions,
          userInfo: me,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.error("AI response error:", error);
    } finally {
      setIsLoading(false);
    }

    // Fallback responses
    if (suggestions.length > 0) {
      const responseIntros = {
        CloudIA: [
          "Great question! I found these helpful pages for you:",
          "Perfect! Here are some options that might help:",
          "I've got some great suggestions for you:",
          "Here's what I found that might interest you:",
        ],
        CloudAL: [
          "I found these relevant pages:",
          "Based on your query, here are the best matches:",
          "Here are some options that should help:",
          "I've identified these relevant sections:",
        ],
      };

      const intros = responseIntros[botType];
      return intros[Math.floor(Math.random() * intros.length)];
    }

    // No matches found
    const noMatchResponses = {
      CloudIA: [
        "Hmm, I'm not sure I understand exactly what you're looking for. Could you try rephrasing that? Here are some popular sections:",
        "I'm having trouble finding exactly what you need. Let me show you some popular areas:",
        "That's a tricky one! While I search for better results, here are some popular sections:",
      ],
      CloudAL: [
        "I couldn't find specific matches for that query. Here are some popular sections:",
        "No exact matches found. Let me suggest some commonly accessed areas:",
        "I don't have specific results for that. Here are some key sections you might find useful:",
      ],
    };

    const responses = noMatchResponses[botType];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const analysisResult = analyzeIntent(input);
      const { suggestions, contextualResponse, requiresAuth, requiresAdmin } =
        analysisResult;

      const botResponseText = await generateBotResponse(input, analysisResult);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isBot: true,
        isContextual: !!contextualResponse,
        requiresAuth,
        requiresAdmin,
        suggestions:
          suggestions.length > 0
            ? suggestions
            : contextualResponse || requiresAuth || requiresAdmin
              ? []
              : [
                  {
                    path: "/",
                    label: "Home",
                    confidence: 0.5,
                    reason: "Main page",
                  },
                  {
                    path: "/flights",
                    label: "Browse Flights",
                    confidence: 0.5,
                    reason: "Popular section",
                  },
                  ...(context.isAuthenticated
                    ? [
                        {
                          path: "/bookings",
                          label: "My Bookings",
                          confidence: 0.5,
                          reason: "Your bookings",
                        },
                      ]
                    : [
                        {
                          path: "/login",
                          label: "Login",
                          confidence: 0.5,
                          reason: "Sign in to access more features",
                        },
                      ]),
                ],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I'm having trouble responding right now. Please try again!",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (path: string, label: string) => {
    // Handle hash navigation
    if (path.includes("#")) {
      const element = document.querySelector(path.split("#")[1]);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.location.hash = path.split("#")[1];
    } else {
      navigate(path);
    }

    const confirmationMessages = {
      CloudIA: [
        `Perfect! Taking you to ${label} now! ✈️`,
        `Great choice! Navigating to ${label}! 🎯`,
        `On my way to ${label}! Hope you find what you're looking for! 🌟`,
      ],
      CloudAL: [
        `Navigating to ${label}`,
        `Taking you to ${label}`,
        `Redirecting to ${label}`,
      ],
    };

    const messages = confirmationMessages[botType];
    const selectedMessage =
      messages[Math.floor(Math.random() * messages.length)];

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: selectedMessage,
        isBot: true,
      },
    ]);

    setTimeout(() => setIsOpen(false), 1500);
  };

  const quickActions = [
    { label: "Where am I?", query: "where am i" },
    { label: "Search flights", query: "search flights" },
    { label: "My bookings", query: "my bookings" },
    { label: "Help", query: "help" },
  ];

  const handleQuickAction = (query: string) => {
    if (isLoading) return;
    setInput(query);
    // Auto-send the query
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-[90px] md:bottom-[110px] right-4 md:right-6 w-80 h-96 bg-background rounded-lg shadow-xl border z-50 flex flex-col">
      <div className="p-2 bg-primary rounded-t-lg">
        <h3 className="font-medium text-sm text-black">
          {botConfig.name}: {botConfig.title}
        </h3>
        <div className="text-xs text-gray-700">
          {context.isAuthenticated ? (
            <span>✅ Logged in {context.isAdmin ? "• Admin" : ""}</span>
          ) : (
            <span>👋 Guest user</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg text-sm ${
                msg.isBot ? "bg-accent" : "bg-primary text-background"
              }`}
            >
              <div className="text-xs leading-relaxed">{msg.text}</div>
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleSuggestionClick(suggestion.path, suggestion.label)
                      }
                      className="block w-full text-left p-1.5 text-background bg-primary hover:bg-primary/80 rounded text-xs border transition-colors"
                    >
                      <div className="font-medium text-xs">
                        {suggestion.label}
                      </div>
                      <div className="text-xs text-gray-600 opacity-80">
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

      {/* Quick Actions */}
      <div className="px-2 py-1.5 border-t bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action.query)}
              className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-xs transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-2 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="What are you looking for?"
            disabled={isLoading}
            className="flex-1 px-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-3 py-1.5 bg-primary text-background rounded-lg hover:bg-primary/80 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

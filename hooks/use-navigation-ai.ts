import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMe } from "@/contexts/use-user";

interface NavSuggestion {
  path: string;
  label: string;
  confidence: number;
  reason: string;
}

interface NavContext {
  currentPath: string;
  pageViews: Record<string, number>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentPageDescription: string;
}

// Enhanced bot configurations with personality
const BOT_CONFIGS = {
  CloudIA: {
    name: "CloudIA",
    title: "Nav Agent",
    greeting:
      "Hi! I'm CloudIA, your friendly Cloud9 Navigation Intelligence Assistant! ✈️",
    helpText:
      "I'm here to help you navigate through Cloud9 smoothly. Whether you're looking for flights, managing bookings, or need help finding your way around, just ask me! What can I help you with today?",
    personality: "friendly, helpful, and enthusiastic",
    pronouns: "she/her",
  },
  CloudAL: {
    name: "CloudAL",
    title: "Assistant",
    greeting:
      "Hello! I'm CloudAL, your intelligent Cloud9 navigation assistant.",
    helpText:
      "I'm here to provide efficient navigation assistance for Cloud9. I can help you find flights, manage your bookings, or guide you to any section of the platform. How may I assist you?",
    personality: "professional, efficient, and knowledgeable",
    pronouns: "he/him",
  },
};

// Enhanced routes with detailed information
const ROUTES = [
  {
    path: "/",
    label: "Home",
    description:
      "Main landing page with destination carousel, flight search, featured flights, and testimonials",
    keywords: [
      "home",
      "main",
      "start",
      "landing",
      "carousel",
      "destinations",
      "featured flights",
    ],
    requiresAuth: false,
    adminOnly: false,
  },
  {
    path: "/flights",
    label: "Flights",
    description: "Browse and search available flights",
    keywords: [
      "flight",
      "flights",
      "plane",
      "airline",
      "search flights",
      "available flights",
      "browse flights",
    ],
    requiresAuth: true,
    adminOnly: false,
  },
  {
    path: "/bookings",
    label: "Bookings",
    description: "View and manage your flight bookings",
    keywords: [
      "booking",
      "bookings",
      "reservation",
      "itinerary",
      "my bookings",
      "reservations",
    ],
    requiresAuth: true,
    adminOnly: false,
  },
  {
    path: "/profile",
    label: "Profile",
    description: "View and update your profile information and testimonials",
    keywords: [
      "account",
      "profile",
      "personal details",
      "update profile",
      "testimonial",
      "my account",
    ],
    requiresAuth: true,
    adminOnly: false,
  },
  {
    path: "/#contact-us",
    label: "Contact Support",
    description: "Contact our support team",
    keywords: [
      "contact",
      "support",
      "help",
      "message",
      "contact us",
      "customer service",
    ],
    requiresAuth: false,
    adminOnly: false,
  },
  {
    path: "/#search-flights",
    label: "Search Flights",
    description: "Search for flights by destination and departure airports",
    keywords: [
      "search",
      "find flights",
      "flight search",
      "destination",
      "departure",
      "arrival",
    ],
    requiresAuth: false,
    adminOnly: false,
  },
  {
    path: "/login",
    label: "Login",
    description: "Sign in to your account",
    keywords: ["login", "sign in", "authenticate", "log in"],
    requiresAuth: false,
    adminOnly: false,
    hideWhenAuthenticated: true,
  },
  {
    path: "/register",
    label: "Register",
    description: "Create a new account",
    keywords: ["register", "sign up", "create account", "new account"],
    requiresAuth: false,
    adminOnly: false,
    hideWhenAuthenticated: true,
  },
  {
    path: "/admin",
    label: "Admin Dashboard",
    description:
      "Administrative dashboard with statistics and management tools",
    keywords: [
      "admin",
      "dashboard",
      "administration",
      "manage",
      "statistics",
      "admin panel",
    ],
    requiresAuth: true,
    adminOnly: true,
  },
  {
    path: "/admin/users",
    label: "User Management",
    description: "View and manage users",
    keywords: ["users", "user management", "manage users", "user list"],
    requiresAuth: true,
    adminOnly: true,
  },
  {
    path: "/admin/flights",
    label: "Flight Management",
    description: "Create and manage flights",
    keywords: [
      "flight management",
      "manage flights",
      "create flights",
      "flight admin",
    ],
    requiresAuth: true,
    adminOnly: true,
  },
  {
    path: "/admin/bookings",
    label: "Booking Management",
    description: "View and manage bookings",
    keywords: ["booking management", "manage bookings", "booking admin"],
    requiresAuth: true,
    adminOnly: true,
  },
  {
    path: "/admin/testimonials",
    label: "Testimonial Management",
    description: "View and manage testimonials",
    keywords: [
      "testimonial management",
      "manage testimonials",
      "testimonial admin",
    ],
    requiresAuth: true,
    adminOnly: true,
  },
  {
    path: "/admin/banners",
    label: "Banner Management",
    description: "Create and manage destination banners",
    keywords: [
      "banner management",
      "manage banners",
      "destination banners",
      "carousel banners",
    ],
    requiresAuth: true,
    adminOnly: true,
  },
  {
    path: "/privacy-policy",
    label: "Privacy Policy",
    description: "View our privacy policy",
    keywords: ["privacy", "privacy policy", "data protection", "terms"],
    requiresAuth: false,
    adminOnly: false,
  },
  {
    path: "/terms-and-conditions",
    label: "Terms and Conditions",
    description: "View our terms and conditions",
    keywords: ["terms", "conditions", "terms and conditions", "legal"],
    requiresAuth: false,
    adminOnly: false,
  },
];

// Enhanced similarity function
const similarity = (s1: string, s2: string): number => {
  const [longer, shorter] = s1.length > s2.length ? [s1, s2] : [s2, s1];
  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (s1: string, s2: string): number => {
  const matrix = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  return matrix[s2.length][s1.length];
};

// Helper function to get page description
const getPageDescription = (path: string): string => {
  const route = ROUTES.find((r) => r.path === path || path.startsWith(r.path));
  if (route) return route.description;

  // Handle dynamic routes
  if (path.startsWith("/admin/")) {
    if (path.includes("/users/")) return "User details and management";
    if (path.includes("/flights/")) return "Flight details and management";
    if (path.includes("/bookings/")) return "Booking details and management";
    if (path.includes("/testimonials/"))
      return "Testimonial details and management";
    if (path.includes("/banners/")) return "Banner details and management";
  }

  if (path.startsWith("/flights/")) return "Flight details and booking";
  if (path.startsWith("/bookings/")) return "Booking details and information";
  if (path.startsWith("/payments/")) return "Payment processing and status";

  return "Cloud9 page";
};

export const useNavigationAI = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { me, isLoading } = useMe();

  const [context, setContext] = useState<NavContext>({
    currentPath: "/",
    pageViews: {},
    isAuthenticated: false,
    isAdmin: false,
    currentPageDescription: "Cloud9 home page",
  });

  // Update context when user data or pathname changes
  useEffect(() => {
    if (!isLoading) {
      const isAuthenticated = !!me;
      const isAdmin = me ? ["ADMIN", "MAIN_ADMIN"].includes(me.role) : false;
      const currentPageDescription = getPageDescription(pathname);

      setContext((prev) => ({
        ...prev,
        currentPath: pathname,
        isAuthenticated,
        isAdmin,
        currentPageDescription,
      }));
    }
  }, [me, isLoading, pathname]);

  const analyzeIntent = useCallback(
    (
      query: string
    ): {
      suggestions: NavSuggestion[];
      contextualResponse: string;
      requiresAuth?: boolean;
      requiresAdmin?: boolean;
    } => {
      const q = query.toLowerCase();
      const suggestions: NavSuggestion[] = [];
      let contextualResponse = "";
      let requiresAuth = false;
      let requiresAdmin = false;

      // Handle contextual queries
      if (
        q.includes("where am i") ||
        q.includes("current page") ||
        q.includes("what page")
      ) {
        contextualResponse = `You're currently on: ${context.currentPageDescription}`;
        return { suggestions: [], contextualResponse };
      }

      // Handle authentication status queries
      if (
        q.includes("logged in") ||
        q.includes("signed in") ||
        q.includes("authenticated")
      ) {
        contextualResponse = context.isAuthenticated
          ? "Yes, you're currently logged in to Cloud9!"
          : "You're not currently logged in. Would you like to sign in?";
        if (!context.isAuthenticated) {
          suggestions.push({
            path: "/login",
            label: "Login",
            confidence: 0.9,
            reason: "Sign in to access your account",
          });
        }
        return { suggestions, contextualResponse };
      }

      // Handle admin queries
      if (q.includes("admin") && !context.isAdmin && context.isAuthenticated) {
        contextualResponse =
          "You don't have admin privileges to access administrative functions.";
        return { suggestions: [], contextualResponse };
      }

      // Filter routes based on user permissions
      const availableRoutes = ROUTES.filter((route) => {
        if (route.adminOnly && !context.isAdmin) return false;
        if (route.requiresAuth && !context.isAuthenticated) return false;
        if (route.hideWhenAuthenticated && context.isAuthenticated)
          return false;
        return true;
      });

      // Analyze intent for available routes
      availableRoutes.forEach((route) => {
        let confidence = 0;
        let reason = "";

        // Exact keyword match
        if (route.keywords.some((k) => q.includes(k))) {
          confidence += 0.8;
          reason = "Keyword match";
        }

        // Fuzzy match
        const fuzzyScore = Math.max(
          ...route.keywords.map((k) => similarity(q, k))
        );
        if (fuzzyScore > 0.6) {
          confidence += fuzzyScore * 0.6;
          reason = reason || "Similar content";
        }

        // Visit history boost
        const visitCount = context.pageViews[route.path] || 0;
        if (visitCount > 0) {
          confidence += Math.min(visitCount * 0.1, 0.2);
          reason = reason || "Previously visited";
        }

        // Current page context boost
        if (route.path === context.currentPath) {
          confidence += 0.3;
          reason = "Current page";
        }

        if (confidence > 0.3) {
          suggestions.push({
            path: route.path,
            label: route.label,
            confidence,
            reason,
          });
        }
      });

      // Check if query requires authentication
      if (q.includes("booking") || q.includes("profile") || q.includes("my")) {
        requiresAuth = !context.isAuthenticated;
      }

      // Check if query requires admin access
      if (
        q.includes("admin") ||
        q.includes("manage") ||
        q.includes("dashboard")
      ) {
        requiresAdmin = !context.isAdmin;
      }

      return {
        suggestions: suggestions
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3),
        contextualResponse,
        requiresAuth,
        requiresAdmin,
      };
    },
    [context]
  );

  const updateContext = useCallback((path: string) => {
    setContext((prev) => ({
      ...prev,
      currentPath: path,
      pageViews: { ...prev.pageViews, [path]: (prev.pageViews[path] || 0) + 1 },
      currentPageDescription: getPageDescription(path),
    }));
  }, []);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      updateContext(path);
    },
    [router, updateContext]
  );

  return { analyzeIntent, navigate, context };
};

export { BOT_CONFIGS };
export type BotType = keyof typeof BOT_CONFIGS;

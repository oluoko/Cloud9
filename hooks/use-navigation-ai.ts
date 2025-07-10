import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface NavSuggestion {
  path: string;
  label: string;
  confidence: number;
  reason: string;
}

interface NavContext {
  currentPath: string;
  userHistory: string[];
  pageViews: Record<string, number>;
  searchQuery?: string;
}

export const useNavigationAI = () => {
  const router = useRouter();
  const [context, setContext] = useState<NavContext>({
    currentPath: "/",
    userHistory: [],
    pageViews: {},
  });

  const routes = [
    { path: "/", label: "Home", keywords: ["home", "main", "start"] },
    {
      path: "/flights",
      label: "Flights",
      keywords: ["flight", "flights", "plane", "airline"],
    },
    {
      path: "/bookings",
      label: "Bookings",
      keywords: ["booking", "bookings", "reservation", "itinerary"],
    },
    {
      path: "/profile",
      label: "Profile",
      keywords: ["account", "profile", "personal details"],
    },
    {
      path: "/#contact-us",
      label: "Contact",
      keywords: ["contact us", "support", "help"],
    },
    {
      path: "/admin",
      label: "Admin",
      keywords: ["roles", "admin", "administration", "manage"],
    },
    {
      path: "/testimonials",
      label: "Testimonials",
      keywords: ["testimonial", "testimonial", "rating", "comment", "quote"],
    },
  ];

  const analyzeIntent = useCallback(
    (query: string): NavSuggestion[] => {
      const q = query.toLowerCase();
      const suggestions: NavSuggestion[] = [];

      routes.forEach((route) => {
        let confidence = 0;
        let reason = "";

        // Exact match
        if (route.keywords.some((k) => q.includes(k))) {
          confidence += 0.8;
          reason = "Keyword match";
        }

        // Fuzzy match
        const fuzzyScore = route.keywords.reduce((score, keyword) => {
          return Math.max(score, similarity(q, keyword));
        }, 0);

        if (fuzzyScore > 0.6) {
          confidence += fuzzyScore * 0.6;
          reason = reason || "Similar content";
        }

        // Context-based scoring
        const visitCount = context.pageViews[route.path] || 0;
        if (visitCount > 0) {
          confidence += Math.min(visitCount * 0.1, 0.2);
          reason = reason || "Previously visited";
        }

        if (confidence > 0.3) {
          suggestions.push({ ...route, confidence, reason });
        }
      });

      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);
    },
    [context]
  );

  const updateContext = useCallback((path: string) => {
    setContext((prev) => ({
      ...prev,
      currentPath: path,
      userHistory: [path, ...prev.userHistory.slice(0, 9)],
      pageViews: { ...prev.pageViews, [path]: (prev.pageViews[path] || 0) + 1 },
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

// Similarity function for fuzzy matching
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
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
}

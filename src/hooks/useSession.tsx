import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export const useSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { data: session, isLoading } = api.auth.getSession.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (session?.spotifyId) {
      setIsAuthenticated(true);
      setUserId(session.spotifyId);
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, [session]);

  return {
    isAuthenticated,
    isLoading,
    userId,
  };
};

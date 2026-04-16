import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { useData } from "vike-react/useData";
import { logger } from "@/lib/logger";
import type { Data } from "@/pages/+data";
import type { Session } from "@/types/auth";
import { reload } from "vike/client/router";
export interface SessionData {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionData | null>(null);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const { session } = useData<Data>();
  const [currentSession, setSession] = useState<Session | null>(session);

  useEffect(() => {
    if (!currentSession) return;
    logger.info("Current Session: ", currentSession);
    reload();
  }, [currentSession]);

  return (
    <SessionContext.Provider value={{ session: currentSession, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

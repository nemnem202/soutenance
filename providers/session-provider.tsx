import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import type { Session } from "@/types/auth";
import { onSessionRequest } from "@/telefunc/session.telefunc";
export interface SessionData {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionData | null>(null);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const session = await onSessionRequest();
      if (session) setSession(session);
    };

    getSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

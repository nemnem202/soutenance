import { createContext, type Dispatch, type ReactNode, type SetStateAction, useState } from "react";
import { useData } from "vike-react/useData";
import type { Data } from "@/pages/+data";
import type { Session } from "@/types/auth";
export interface SessionData {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionData | null>(null);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const { session } = useData<Data>();
  const [currentSession, setSession] = useState<Session | null>(session);

  return (
    <SessionContext.Provider value={{ session: currentSession, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

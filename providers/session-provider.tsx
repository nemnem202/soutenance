import { Session } from "@/types/session";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export interface SessionData {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionData | null>(null);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}

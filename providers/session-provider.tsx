import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { getRandomAccount } from "@/lib/utils";
import type { Session } from "@/types/auth";
export interface SessionData {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionData | null>(null);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const placeholder_account = getRandomAccount();
  const placeholder_session: Session = {
    profilePictureSource: placeholder_account.picture,
    id: placeholder_account.id,
    username: placeholder_account.firstName,
  };
  const [session, setSession] = useState<Session | null>(placeholder_session);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

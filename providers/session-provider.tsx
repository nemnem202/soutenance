import { getRandomAccount } from "@/lib/utils";
import { Data } from "@/pages/+data";
import { Session } from "@/types/session";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useData } from "vike-react/useData";

export interface SessionData {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionData | null>(null);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const placeholder_account = getRandomAccount();
  const placeholder_session: Session = {
    profilePictureSource: placeholder_account.picture,
    userId: placeholder_account.id,
    username: placeholder_account.firstName,
  };
  const [session, setSession] = useState<Session | null>(placeholder_session);

  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}

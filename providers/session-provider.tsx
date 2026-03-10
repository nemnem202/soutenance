import { getRandomAccount } from "@/pages/+data";
import { Account } from "@/types/account";
import { Session } from "@/types/session";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

const PLACEHOLDER_ACCOUNT: Account = getRandomAccount();

const PLACEHOLDER_SESSION: Session = {
  profilePictureSource: PLACEHOLDER_ACCOUNT.picture,
  userId: PLACEHOLDER_ACCOUNT.id,
  username: PLACEHOLDER_ACCOUNT.firstName,
};

export interface SessionData {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionData | null>(null);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(PLACEHOLDER_SESSION);

  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
}

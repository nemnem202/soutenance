import { Session } from "@/types/session";
import { faker } from "@faker-js/faker";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

const PLACEHOLDER_SESSION: Session = {
  profilePictureSource: faker.image.avatar(),
  userId: faker.string.uuid(),
  username: faker.person.firstName(),
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

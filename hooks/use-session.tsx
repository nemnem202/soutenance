import { useContext } from "react";
import { SessionContext, type SessionData } from "@/providers/session-provider";

export default function useSession(): SessionData {
  const sessionData = useContext(SessionContext);
  if (!sessionData)
    throw new Error("use session must be called inside it's provider.");
  return sessionData;
}

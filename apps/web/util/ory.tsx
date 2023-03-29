import { Session } from "@ory/client";

export const getRoleFromSession = (session: Session) => session?.identity.traits.role;
export const getUserIdFromSession = (session: Session) => session?.identity?.id;
export const getUserFullNameFromSession = (session: Session) => `${session?.identity?.traits?.name?.given} ${session?.identity?.traits?.name?.family}`
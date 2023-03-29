import { Session } from '@ory/client'
import React, { useContext, useState } from 'react'

export const SessionContext = React.createContext({
  session:  undefined,
  setSession: (session) => null,
  logoutUrl: undefined,
  setLogoutUrl: (logoutUrl) => null,
  
})

export const useSession = () => useContext(SessionContext)

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState<Session | undefined>()
  const [logoutUrl, setLogoutUrl] = useState<string | undefined>();

  return <SessionContext.Provider value={{ session, setSession, logoutUrl, setLogoutUrl }}>{children}</SessionContext.Provider>
}
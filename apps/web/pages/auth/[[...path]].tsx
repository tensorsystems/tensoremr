import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import SuperTokens from 'supertokens-auth-react'
import { redirectToAuth } from 'supertokens-auth-react'

const SuperTokensComponentNoSSR = dynamic<React.ComponentProps<typeof SuperTokens.getRoutingComponent>>(
  new Promise((res) => res(SuperTokens.getRoutingComponent)),
  { ssr: false }
)

export default function Auth() {

  // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
  useEffect(() => {
    if (SuperTokens.canHandleRoute() === false) {
      redirectToAuth()
    }
  }, [])

  return (
     <div className="bg-gray-600 h-screen flex items-center justify-center">
       <SuperTokensComponentNoSSR />
     </div>
  )
}
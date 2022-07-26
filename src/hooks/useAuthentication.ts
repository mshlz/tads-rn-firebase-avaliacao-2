import React from 'react'
import { auth, firebase } from '../firebase'

export function useAuthentication() {
  const [user, setUser] = React.useState<firebase.User>(auth.currentUser)

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user)
      } else {
        setUser(undefined)
      }
    })

    return unsubscribeFromAuthStatuChanged
  }, [])

  return {
    user
  }
}

import React, { useEffect } from "react"
import { Text, View } from "react-native"
import { auth } from "../../firebase"

export function LogoutScreen() {
  useEffect(() => {
    auth.signOut()
  }, [])
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Logout...</Text>
    </View>
  )
}
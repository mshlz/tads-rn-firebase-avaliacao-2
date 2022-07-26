
import { useNavigation } from "@react-navigation/native"
import React, { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { auth } from '../../firebase'
import { useAuthentication } from "../../hooks/useAuthentication"
import { Button } from "../../components/Button"

export function HomeScreen() {
  const { user } = useAuthentication()

  const handleSignOut = async () => {
    await auth.signOut()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {'\n'} {user.email}</Text>
      <Text style={styles.subtitle}>ID: {user.uid}</Text>

      <Button onPress={() => handleSignOut()} text="Sign out" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  subtitle: {
    margin: 10
  }
})
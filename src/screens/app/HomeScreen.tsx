
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Button } from "../../components/Button"
import { auth, firestore } from '../../firebase'
import { useAuthentication } from "../../hooks/useAuthentication"

export function HomeScreen() {
  const { user } = useAuthentication()
  const [data, setData] = useState(null)

  useEffect(() => {
    (async () => {
      const _data = (await firestore.doc(`${user.uid}/info`).get()).data()
      setData(_data)
    })()
  }, [])

  const handleSignOut = async () => {
    await auth.signOut()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {'\n'} {user?.email}</Text>
      <Text style={styles.subtitle}>ID: {user?.uid}</Text>
      <Text style={styles.subtitle}>Nome: {data?.name}</Text>
      <Text style={styles.subtitle}>Email: {data?.email}</Text>
      <Text style={styles.subtitle}>CPF: {data?.cpf}</Text>

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
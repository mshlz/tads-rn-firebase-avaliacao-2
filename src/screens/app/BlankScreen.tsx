
import { useNavigation, useNavigationState } from "@react-navigation/native"
import React from "react"
import { Text, View } from "react-native"

export function BlankScreen() {
  const navigation = useNavigation()
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Blank page! Waiting to add a game here</Text>
    </View>
  )
}
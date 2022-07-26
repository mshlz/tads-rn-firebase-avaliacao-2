import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from "react"
import 'react-native-gesture-handler'
import { useAuthentication } from './src/hooks/useAuthentication'
import { EscreverScreen, HomeScreen, ListaComFiltroScreen, ListarScreen, LogoutScreen } from './src/screens/app'
import { ImagePickerScreen } from './src/screens/app/ImagePickerScreen'
import { MapScreen } from './src/screens/app/MapScreen'
import { LoginScreen, RegisterScreen } from './src/screens/auth'


const Drawer = createDrawerNavigator()
const AppNavigator = (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Escrever" component={EscreverScreen} />
    <Drawer.Screen name="Listar" component={ListarScreen} />
    <Drawer.Screen name="Listar com filtro" component={ListaComFiltroScreen} />
    <Drawer.Screen name="Sair" component={LogoutScreen} />
  </Drawer.Navigator>
)

const Stack = createStackNavigator()
const AuthNavigator = (
  <Stack.Navigator>
    <Stack.Screen name="Image" component={MapScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
)

export default function App() {
  const { user } = useAuthentication()

  return (
    <NavigationContainer>
      {user ? AppNavigator : AuthNavigator}
    </NavigationContainer>
  )
}

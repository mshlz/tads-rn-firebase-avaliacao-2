
import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { View } from "react-native"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { auth } from '../../firebase'

type InputState = {
    email: string,
    password: string
}

export function RegisterScreen() {
    const navigation = useNavigation()
    const [input, setInput] = useState<InputState>({ email: "", password: "" })

    const handle = async () => {
        try {
            await auth.createUserWithEmailAndPassword(input.email, input.password)
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15 }}>
            <Input
                label="Email"
                onChangeText={value => setInput({ ...input, email: value })}
            />
            <Input
                label="Password"
                onChangeText={value => setInput({ ...input, password: value })}
                secureTextEntry={true}
            />
            <Button onPress={() => handle()} text="Register" />

            <Button onPress={() => navigation.navigate("Login" as never)} text="Login" style={{ backgroundColor: "white" }} textStyle={{ color: "#000" }} />
        </View>
    )
}
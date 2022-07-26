
import { StackActions, useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { View } from "react-native"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { auth } from '../../firebase'

type InputState = {
    email: string,
    password: string
}

export function LoginScreen() {
    const navigation = useNavigation()
    const [input, setInput] = useState<InputState>({ email: "", password: "" })

    const handle = async () => {
        try {
            await auth.signInWithEmailAndPassword(input.email, input.password)
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }

    const handleForgot = async () => {
        try {
            if (!input.email) {
                alert("Invalid email")
            } else {
                await auth.sendPasswordResetEmail(input.email)
                alert("Recovery email sent successfully")
            }
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
            <Button onPress={() => handle()} text="Login" />

            <Button onPress={() => navigation.navigate("Register" as never)} text="Register" style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#e2e2e2" }} textStyle={{ color: "#000" }} />

            {/* <Button onPress={() => handleForgot()} text="Send recovery message" style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#e2e2e2" }} textStyle={{ color: "#000" }} /> */}
        </View>
    )
}
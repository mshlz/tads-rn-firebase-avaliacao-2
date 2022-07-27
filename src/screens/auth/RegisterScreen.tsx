
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { View } from "react-native"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { auth, firestore } from '../../firebase'

type InputState = {
    name: string,
    cpf: string,
    email: string,
    password: string
}

export function RegisterScreen() {
    const navigation = useNavigation()
    const [input, setInput] = useState<InputState>({ email: "", password: "", name: "", cpf: "" })

    const handle = async () => {
        try {
            const credential = await auth.createUserWithEmailAndPassword(input.email, input.password)
            await firestore.doc(`${credential.user.uid}/info`).set({
                email:input.email,
                name:input.name,
                cpf:input.cpf
            })
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15 }}>
            <Input
                label="Nome"
                onChangeText={value => setInput({ ...input, name: value })}
            />
            <Input
                label="CPF"
                onChangeText={value => setInput({ ...input, cpf: value })}
            />
            <Input
                label="Email"
                onChangeText={value => setInput({ ...input, email: value })}
            />
            <Input
                label="Senha"
                onChangeText={value => setInput({ ...input, password: value })}
                secureTextEntry={true}
            />
            <Button onPress={() => handle()} text="Register" />

            <Button onPress={() => navigation.navigate("Login" as never)} text="Login" style={{ backgroundColor: "white" }} textStyle={{ color: "#000" }} />
        </View>
    )
}
import { StyleSheet, Text, TextProps, TouchableOpacity, TouchableOpacityProps } from "react-native"

interface ButtonProps extends TouchableOpacityProps {
    text: string
    textStyle?: TextProps['style']
}

export const Button = (props: ButtonProps) => {
    return <TouchableOpacity {...props} style={[styles.button, props.style]}>
        <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: "blue",
        borderRadius: 8,
        width: "100%",
        marginBottom: 10,
    },
    text: {
        textAlign: "center",
        color: "#fff"
    }
})
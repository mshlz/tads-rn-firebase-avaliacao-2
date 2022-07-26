import React, { useState } from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { firestore } from '../../firebase'
import { useAuthentication } from '../../hooks/useAuthentication'
// import MeuEstilo from '../meuestilo'

export const EscreverScreen = () => {
  const { user } = useAuthentication()
  const [nome, setNome] = useState('')
  const [raca, setRaca] = useState('')
  const [cor, setCor] = useState('')


  const enviarDados = async () => {
    const gatos = firestore.collection(`${user.uid}/animais/gatos`)
    const gatoRef = gatos.doc()

    gatoRef.set({
      uid: gatoRef.id,
      nome: nome,
      raca: raca,  
      cor: cor,  
    })
    .then(() => {
      alert('Gato ' + nome + ' Adicionado com Sucesso')
    })
  }

  const limparFormulario = () => {

  }

  return (
    <KeyboardAvoidingView
      // style={MeuEstilo.containerlistar}
      behavior="padding"
    >
      <View>
        <Input
          placeholder="Nome"
          value={nome}
          onChangeText={text => setNome(text)}
        />
        <Input
          placeholder="Raça"
          value={raca}
          onChangeText={text => setRaca(text)}
        />
        <Input
          placeholder="Cor"
          value={cor}
          onChangeText={text => setCor(text)}
        />

      </View>

      <View >
        <Button
          onPress={enviarDados}
          text="Enviar Dados"
        />
        <Button
          onPress={limparFormulario}
          text="Limpar Formulario"
        />
      </View>
    </KeyboardAvoidingView>
  )
}



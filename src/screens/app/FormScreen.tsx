import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { firestore, storage } from '../../firebase';
import { useAuthentication } from '../../hooks/useAuthentication';

export type FormInput = {
  name: string
  img: string
  lat: number
  lng: number
}
export type ItemData = FormInput & { uid: string }

const DEFAULT_VALUES = {
  name: "",
  img: "",
  lat: 0,
  lng: 0
}

export const FormScreen = () => {
  const { user } = useAuthentication()
  const route = useRoute()
  const routeId = route.params?.['id']

  const [id, setId] = useState<string>(routeId)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<FormInput>(DEFAULT_VALUES)

  useEffect(() => {
    setId(routeId)
  }, [routeId]) // fica observando se mudou o id da rota, se sim atualiza o id e recarrega a pagina

  useEffect(() => {
    if (id) {
      (async () => {
        const item =
          await firestore.collection(`${user.uid}/data/items`).doc(id).get()

        if (item.exists) {
          setId(id)
          setData({ ...item.data() } as any)
        } else {
          setId(null)
        }
        setLoading(false)
      })()
    }
  }, [id])  // fica observando se o id mudou, se sim, preenche o formulario com os dados

  // funcao que envia os dados
  const sendData = async () => {
    if (!data.name || !data.img) {
      alert('voce deve preencher todos campos')
      return
    }

    setLoading(true)
    const items = firestore.collection(`${user.uid}/data/items`)
    const itemRef = id ? items.doc(id) : items.doc()

    const imgUrl =
      (!id || (await itemRef.get()).data().img != data.img) // se nao tem id ou se a url da img é diferente, então faz upload, senão nao faz nada
        ? await uploadImage(`${user.uid}/${Date.now()}.jpg`, data.img)
        : data.img

    return itemRef.set({
      uid: itemRef.id,
      ...data,
      img: imgUrl,
    })
      .then(() => { // tudo certo
        setId(itemRef.id)
        setData({ ...data, img: imgUrl })
        alert(`Item ${id ? 'atuallizado' : 'adicionado'} com sucesso`)
      })
      .catch(err => { // deu erro
        alert(`Ocorreu um erro ao adicionar :: ${err.message}`)
      })
      .finally(() => { // no final, remove o estado de loading
        setLoading(false)
      })
  }

  // faz upload e retorna o link da imagem
  const uploadImage = async (path: string, uri: string) => {
    const blob = await (await fetch(uri)).blob()
    const ref = storage.ref(`images/${path}`)
    const result = await uploadBytes(ref, blob)
    const imgUrl = await getDownloadURL(result.ref)
    return imgUrl
  }

  // abrir galeria
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setData({ ...data, img: (result as ImagePicker.ImageInfo).uri });
    }
  };

  // abrir camera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // aspect: [4, 3],
      allowsEditing: true
    });

    if (!result.cancelled) {
      setData({ ...data, img: (result as ImagePicker.ImageInfo).uri });
    }
  }

  // limpar formulario
  const clearForm = () => {
    setData(DEFAULT_VALUES)
    setId(undefined)
    if (route.params?.['id']) {
      route.params['id'] = null
    }
  }

  if (loading) {
    return (
      <>
        <ActivityIndicator />
        <Text>Carregando...</Text>
      </>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
    >
      <View>
        {id && <Text>Editando item: {id}</Text>}
        <Input
          label="Nome do lugar"
          placeholder="Nome do lugar"
          value={data.name}
          onChangeText={text => setData({ ...data, name: text })}
        />
        <Input
          label="Latitude"
          placeholder="Latitude"
          keyboardType="decimal-pad"
          value={data.lat.toString()}
          onChangeText={text => setData({ ...data, lat: parseFloat(text || '0') })}
        />
        <Input
          label="Longitude"
          placeholder="Longitude"
          keyboardType="decimal-pad"
          value={data.lng.toString()}
          onChangeText={text => setData({ ...data, lng: parseFloat(text || '0') })}
        />
        <View>
          {data.img ? <Image source={{ uri: data.img }} style={{ width: 200, height: 200, alignSelf: 'center' }} /> : <></>}

          <Button
            onPress={pickImage}
            text="Selecionar imagem"
            style={{ backgroundColor: "#baa" }}
          />
          <Button
            onPress={takePhoto}
            text="Tirar foto"
            style={{ backgroundColor: "#baa" }}
          />
        </View>

      </View>

      <View >
        <Button
          onPress={sendData}
          text="Salvar Dados"
        />
        <Button
          onPress={clearForm}
          text="Limpar Formulario"
        />
      </View>
    </KeyboardAvoidingView >
  )
}



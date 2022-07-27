import { useEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuthentication } from '../hooks/useAuthentication';
import { firestore, storage } from '../firebase';
import { Input } from './Input';
import { Button } from './Button';

type FormData = {
  name: string
  img: string
  lat: number
  lng: number
}

const DEFAULT_VALUES = {
  name: "",
  img: "",
  lat: 0,
  lng: 0
}

type ItemFormProps = {
  id?: string
}
export const ItemForm = (props: ItemFormProps) => {
  const { user } = useAuthentication()
  const [id, setId] = useState<string>(props.id)
  const [loading, setLoading] = useState<boolean>(!!props.id)
  const [data, setData] = useState<FormData>(DEFAULT_VALUES)

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
  }, [])

  const sendData = async () => {
    const items = firestore.collection(`${user.uid}/data/items`)
    const itemRef = id ? items.doc(id) : items.doc()

    const imgUrl =
      (!id || (await itemRef.get()).data().img != data.img)
        ? await uploadImage(`${user.uid}/${Date.now()}.jpg`, data.img)
        : data.img

    return itemRef.set({
      uid: itemRef.id,
      ...data,
      img: imgUrl,
    }).then(() => {
      setId(itemRef.id)
      setData({ ...data, img: imgUrl })
      alert(`Item ${id ? 'atuallizado' : 'adicionado'} com sucesso`)
    }).catch(err => {
      alert(`Ocorreu um erro ao adicionar :: ${err.message}`)
    })
  }

  const uploadImage = async (path: string, uri: string) => {
    const blob = await (await fetch(uri)).blob()
    const ref = storage.ref(`images/${path}`)
    const utsk = await uploadBytes(ref, blob)
    const imgUrl = await getDownloadURL(utsk.ref)
    return imgUrl
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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

  const clearForm = () => {
    setData(DEFAULT_VALUES)
  }

  return loading ? (
    <Text>Carregando</Text>
  ) : (
    <KeyboardAvoidingView
      behavior="padding"
    >
      {id && <Text>Editando item: {id}</Text>}
      <View>
        <Input
          placeholder="Nome"
          value={data.name}
          onChangeText={text => setData({ ...data, name: text })}
        />
        <Input
          placeholder="Latitude"
          keyboardType="decimal-pad"
          value={data.lat.toString()}
          onChangeText={text => setData({ ...data, lat: parseFloat(text || '0') })}
        />
        <Input
          placeholder="Longitude"
          keyboardType="decimal-pad"
          value={data.lng.toString()}
          onChangeText={text => setData({ ...data, lng: parseFloat(text || '0') })}
        />
        <View>
          {data.img && <Image source={{ uri: data.img }} style={{ width: 200, height: 200, alignSelf: 'center' }} />}

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



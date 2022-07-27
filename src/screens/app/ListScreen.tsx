import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { firestore } from '../../firebase';
import { useAuthentication } from '../../hooks/useAuthentication';
import { ItemData } from './FormScreen';

export const ListarScreen = () => {
  const { user } = useAuthentication()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ItemData[]>([]);

  useEffect(() => {
    const subscriber = firestore.collection(`${user.uid}/data/items`)
      .onSnapshot(querySnapshot => {
        const _items = [];
        querySnapshot.forEach(documentSnapshot => {
          _items.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          })
        })
        setItems(_items);
        setLoading(false);
      })
    return () => subscriber()
  }, []);



  const Item = ({ item }: { item: ItemData }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, flexDirection: "row" }}>
      <Image source={{ uri: item.img }} style={{ width: 100, height: 100, alignSelf: 'center' }} />
      <View>
        <Text style={{ fontSize: 10 }}>{item.uid}</Text>
        <Text>name: {item.name}</Text>
        <Text>lat: {item.lat}</Text>
        <Text>lng: {item.lng}</Text>
      </View>
    </View>
  );

  {/* se usuario clicar, abre pagina do form passando o id do item */ }
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => { navigation.navigate('Formulário' as never, { id: item.uid } as never) }}
      onLongPress={async () => {
        Alert.alert(`Deseja remover item "${item.name}"`, '', [
          { text: 'Cancelar' },
          { text: 'Apagar', onPress: async () => firestore.doc(`${user.uid}/data/items/${item.uid}`).delete() },
        ])
      }}
    >
      <Item item={item} />
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <ActivityIndicator />
    )
  }

  return (
    <SafeAreaView>
      {/* se nao tiver nenhum item, exibe mensagem */}
      {
        items.length === 0
          ? (<Text style={{ padding: 10 }}>Nenhum item cadastrado!</Text>)
          : (
            <>
              <Text>Clique no item para editar</Text>
              <Text>Clique e segure para deletar</Text>
            </>
          )
      }

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </SafeAreaView>
  );
};

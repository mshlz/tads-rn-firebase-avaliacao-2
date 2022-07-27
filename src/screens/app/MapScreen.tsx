
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { firestore } from "../../firebase";
import { useAuthentication } from "../../hooks/useAuthentication";
import { ItemData } from "./FormScreen";

export function MapScreen() {
  const { user } = useAuthentication()
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
        setItems(_items); // busca todos os itens
        setLoading(false);
      })
    return () => subscriber()
  }, []);

  return (
    <View style={styles.container}>
      {loading ? <Text>Carregando...</Text> : <></>}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -31.330420,
          longitude: -54.106345,
          latitudeDelta: .5,
          longitudeDelta: 0,
        }}
      >
        {items.map(i =>
          <Marker
            key={i.uid}
            title={i.name}
            coordinate={{
              latitude: i.lat,
              longitude: i.lng,
            }}
            draggable={true} // permite que usuario movimente o marker
            onDragEnd={async (e) => { // ao finalizar o movimento, atualiza as coordenadas do marker no firestore
              await firestore.doc(`${user.uid}/data/items/${i.uid}`)
                .update({
                  lat: e.nativeEvent.coordinate.latitude,
                  lng: e.nativeEvent.coordinate.longitude
                })
            }}
          />
        )}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

import { useNavigation, useNavigationState } from "@react-navigation/native"
import React from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import MapView, { Marker } from 'react-native-maps';

export function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -31.330420,
          longitude: -54.106345,
          latitudeDelta: .5,
          longitudeDelta: 0,
        }}
      >
        <Marker
          coordinate={{
            latitude: -31.330420,
            longitude: -54.106345,
          }}
          
        />
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
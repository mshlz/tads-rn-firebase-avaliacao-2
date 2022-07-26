import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from 'react-native';
import { firestore } from '../../firebase';
import { useAuthentication } from '../../hooks/useAuthentication';

export const ListarScreen = () => {
  const { user } = useAuthentication()
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [gatos, setGatos] = useState([]); // Initial empty array of users

  useEffect(() => {
    const subscriber = firestore.collection(`${user.uid}/animais/gatos`)
      .onSnapshot(querySnapshot => {
        const gatos = [];
        querySnapshot.forEach(documentSnapshot => {
          gatos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          })
        })
        setGatos(gatos);
        setLoading(false);
      })
    // Unsubscribe from events when no longer in use
    return () => subscriber()
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const Item = ({ id, nome }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 10 }}>{id}</Text>
      <Text >{nome}</Text>
    </View>
  );



  const renderItem = ({ item }) => <Item nome={item.nome} id={item.uid} />;

  // const getGatos= ()=>{
  //   setGatos([]);
  //   firestore
  //   .collection('Gato')
  //   .onSnapshot(querySnapshot=>{
  //     //querySnapshot.forEach(documentSnapshot=>{
  //     querySnapshot.docChanges().forEach(change=>{

  //       gatos.push({...change.doc.data(),
  //         key: change.nome,
  //       });
  //     });
  //     setGatos(gatos);
  //     // setCarregando(false);
  //   });
  //   // return()=>subscriber();
  // };

  // // const observador = firestore.collection('Gato')
  // // .onSnapshot(querySnapshot => {
  // //   querySnapshot.docChanges().forEach(change => {
  // //     if (change.type === 'added') {
  // //       console.log('Novo Gato: ', change.doc.data());
  // //     }
  // //     if (change.type === 'modified') {
  // //       console.log('Gato modificado: ', change.doc.data());
  // //     }
  // //     if (change.type === 'removed') {
  // //       console.log('Gato removido: ', change.doc.data());
  // //     }
  // //   });
  // // });

  return (
    <SafeAreaView>
      <FlatList
        data={gatos}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      // refreshing={true}
      // onRefresh={() => {
      //   getGatos();
      // }}
      />
    </SafeAreaView>
  );
};

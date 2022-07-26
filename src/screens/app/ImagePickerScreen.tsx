import { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebase';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage'

export const ImagePickerScreen = () => {
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState('');
  const [percent, setPercent] = useState(0);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage((result as ImagePicker.ImageInfo).uri);

      fetch((result as any).uri)
        .then(res => res.blob())
        .then((blob) => upload(`img-${Date.now()}.jpg`, blob))
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // aspect: [4, 3],
      allowsEditing: true
    });

    if (!result.cancelled) {
      setImage((result as ImagePicker.ImageInfo).uri);

      fetch((result as any).uri)
        .then(res => res.blob())
        .then((blob) => upload(`img-${Date.now()}.jpg`, blob))
    }
  }

  const upload = async (name: string, blob: Blob) => {
    if (busy) {
      alert('busy')
      return
    } else {
      setBusy(true)
    }
    const ref = storage.ref(`images/${name}`)
    const uploadTask = uploadBytesResumable(ref, blob)
    uploadTask.on('state_changed',
      snapshot => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => {
        console.log(err)
        setBusy(false)
      },
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          alert('Upload concluido com sucesso')
          console.log(url);
          setLink(url)
        });
        setBusy(false)

      })
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Progress: {percent}% {busy ? '[busy]' : ''}</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


      {link ? <Text onPress={() => Linking.openURL(link)}>Last upload: {link}</Text> : <></>}
    </View>
  );
}
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import { firebaseConfig } from './config'

let app: firebase.app.App
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app()
}

const auth = app.auth()
const firestore = app.firestore()
const storage = app.storage()

export { auth, firestore, storage, firebase }
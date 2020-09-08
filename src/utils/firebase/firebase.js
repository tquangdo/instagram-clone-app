import firebase from "firebase/app"
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseApp = firebase.initializeApp({
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const tiSta = firebase.firestore.FieldValue.serverTimestamp()
const storage = firebase.storage()

export { db, auth, storage, tiSta }
import * as firebase from "firebase/app"

import "firebase/auth"
import "firebase/database"

// ADD YOUR FIREBASE CONFIG OBJECT HERE:
var firebaseConfig = {
  apiKey: "AIzaSyCImvNGQaVy5e19gqztggaj3A2DUlRC_tE",
  authDomain: "geolistics-179c7.firebaseapp.com",
  databaseURL: "https://geolistics-179c7.firebaseio.com",
  projectId: "geolistics-179c7",
  storageBucket: "geolistics-179c7.appspot.com",
  messagingSenderId: "193761662249",
  appId: "1:193761662249:web:a7ed8c5b4229e2767e1338",
  measurementId: "G-48JTSVD22Q"
}

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()

export { firebaseAuth, firebaseDb }
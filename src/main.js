// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import AlertCmp from './components/shared/Alert.vue'

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    firebase.initializeApp({
      apiKey: 'AIzaSyDiXAmAbzhAJx02ctlSiyUqX2_lAP2xPjw',
      authDomain: 'deko-fit-dev.firebaseapp.com',
      databaseURL: 'https://deko-fit-dev.firebaseio.com',
      projectId: 'deko-fit-dev',
      storageBucket: 'deko-fit-dev.appspot.com'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })
    this.$store.dispatch('loadExercises')
  }
})
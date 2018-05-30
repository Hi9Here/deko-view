import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import AlertCmp from './components/shared/Alert.vue'
import EditExerciseDetailsDialog from './components/exercise/Edit/EditExerciseDetailsDialog.vue'
import RegisterDialog from './components/exercise/Register/RegisterDialog.vue'

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-exercise-details-dialog', EditExerciseDetailsDialog)
Vue.component('app-exercise-register-dialog', RegisterDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyD3HPMgDd4HwsmT57om-i8-tVUpb7B3qzY",
      authDomain: "deko-prod.firebaseapp.com",
      databaseURL: "https://deko-prod.firebaseio.com",
      projectId: "deko-prod",
      storageBucket: "deko-prod.appspot.com",
      messagingSenderId: "322648727041"
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadExercises')
  }
})
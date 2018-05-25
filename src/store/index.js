import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedExercises: [{
        imageUrl: 'http://cdn2.coachmag.co.uk/sites/coachmag/files/2017/05/bench-press_0.jpg',
        id: 'cdfgshdjf',
        title: 'Chest Press',
        freq: 3,
        muscle: 'Upper',
        description: 'Just some text that I am throwing in'
      },
      {
        imageUrl: 'http://www.ibodz.com/files/exerciseimages/abdominal-crunch-with-raised-legs-1.JPG',
        id: 'fgdhfj',
        title: 'Ab Crunch',
        freq: 2,
        muscle: 'Middle',
        description: 'This is the ab crunch text, just so you know'
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    createExercise(state, payload) {
      state.loadedExercises.push(payload)
    },
    setUser(state, payload) {
      state.user = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state, payload) {
      state.error = null
    }
  },
  actions: {
    createExercise({ commit }, payload) {
      const exercise = {
          title: payload.title,
          freq: payload.freq,
          imageUrl: payload.imageUrl,
          description: payload.description,
          muscle: payload.muscle,
          id: 'dwefgdhdjg'
        }
        // Reach out to Firebase and store it
      commit('createExercise', exercise)
    },
    signUserUp({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredExercsies: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredExercsies: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    clearError({ commit }) {
      commit('clearError')
    }
  },
  getters: {
    // Changed with 
    loadedExercises(state) {
      return state.loadedExercises.sort((exerciseA, exerciseB) => {
        return exerciseA.freq == exerciseB.freq ? 0 : +(exerciseA.freq > exerciseB.freq) || -1;
      })
    },
    featuredExercises(state, getters) {
      return getters.loadedExercises.slice(0, 5)
    },
    loadedExercise(state) {
      return (exerciseId) => {
        return state.loadedExercises.find((exercise) => {
          return exercise.id === exerciseId
        })
      }
    },
    user(state) {
      return state.user
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  }
})
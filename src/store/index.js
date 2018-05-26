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
    setLoadedExercises(state, payload) {
      state.loadedExercises = payload
    },
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
    loadExercises({ commit }) {
      commit('setLoading', true)
      firebase.database().ref('exercises').once('value')
        .then((data) => {
          const exercises = []
          const obj = data.val()
          for (let key in obj) {
            exercises.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              muscle: obj[key].muscle,
              freq: obj[key].freq,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedExercises', exercises)
          commit('setLoading', false)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', true)
          }
        )
    },
    createExercise({ commit, getters }, payload) {
      const exercise = {
        title: payload.title,
        freq: payload.freq,
        imageUrl: payload.imageUrl,
        description: payload.description,
        muscle: payload.muscle,
        creatorId: getters.user.id
      }
      firebase.database().ref('exercises').push(exercise)
        .then((data) => {
          const key = data.key
          commit('createExercise', {
            ...exercise,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
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
    autoSignIn({ commit }, payload) {
      commit('setUser', { id: payload.uid, registeredExercsies: [] })
    },
    logout({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
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
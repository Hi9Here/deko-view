import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedExercises: [{
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg',
        id: 'afajfjadfaadfa323',
        title: 'Exercise in New York',
        date: new Date(),
        location: 'New York',
        description: 'New York, New York!'
      },
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris_-_Blick_vom_gro%C3%9Fen_Triumphbogen.jpg',
        id: 'aadsfhbkhlk1241',
        title: 'Exercise in Paris',
        date: new Date(),
        location: 'Paris',
        description: 'It\'s Paris!'
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    registerUserForExercise(state, payload) {
      const id = payload.id
      if (state.user.registeredExercises.findIndex(exercise => exercise.id === id) >= 0) {
        return
      }
      state.user.registeredExercises.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromExercise(state, payload) {
      const registeredExercises = state.user.registeredExercises
      registeredExercises.splice(registeredExercises.findIndex(exercise => exercise.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setLoadedExercises(state, payload) {
      state.loadedExercises = payload
    },
    createExercise(state, payload) {
      state.loadedExercises.push(payload)
    },
    updateExercise(state, payload) {
      const exercise = state.loadedExercises.find(exercise => {
        return exercise.id === payload.id
      })
      if (payload.title) {
        exercise.title = payload.title
      }
      if (payload.description) {
        exercise.description = payload.description
      }
      if (payload.date) {
        exercise.date = payload.date
      }
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
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    registerUserForExercise({ commit, getters }, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForExercise', { id: payload, fbKey: data.key })
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    unregisterUserFromExercise({ commit, getters }, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromExercise', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
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
              date: obj[key].date,
              location: obj[key].location,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedExercises', exercises)
          commit('setLoading', false)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
          }
        )
    },
    createExercise({ commit, getters }, payload) {
      const exercise = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('exercises').push(exercise)
        .then((data) => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('exercises/' + key + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('exercises').child(key).update({ imageUrl: imageUrl })
        })
        .then(() => {
          commit('createExercise', {
            ...exercise,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
        // Reach out to firebase and store it
    },
    updateExerciseData({ commit }, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('exercises').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateExercise', payload)
        })
        .catch(error => {
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
              registeredExercises: [],
              fbKeys: {}
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
              registeredExercises: [],
              fbKeys: {}
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
      commit('setUser', {
        id: payload.uid,
        registeredExercises: [],
        fbKeys: {}
      })
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
    loadedExercises(state) {
      return state.loadedExercises.sort((exerciseA, exerciseB) => {
        return exerciseA.date > exerciseB.date
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
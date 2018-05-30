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
              muscle: obj[key].muscle,
              freq: obj[key].freq,
              account: obj[key].account,
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
        description: payload.description,
        muscle: payload.muscle,
        account: payload.account,
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
          return firebase.storage().ref('exercises/' + key + ext).put(payload.image)
        })
        .then(fileData => {
          fileData.ref.getDownloadURL()
            .then(url => {
              imageUrl = url
              console.log('File available at', url);
              return firebase.database().ref('exercises').child(key).update({ imageUrl: url })
            })
        })
        .then(() => {
          commit('createExercise', {
            ...exercise,
            imageUrl: imageUrl,
            id: key
          })
        })
    },
    upDateExerciseData({ commit }, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
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
    fetchUserData({ commit, getters }) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredExercises = []
          let swapperPairs = []
          for (let key in dataPairs) {
            registeredExercises.push(dataPairs[key])
            swapperPairs[dataPairs[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            registeredExercises: registeredExercises,
            fbKeys: swapperPairs
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
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
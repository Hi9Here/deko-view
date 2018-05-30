import * as firebase from 'firebase'

export default {
  state: {
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
    setUser(state, payload) {
      state.user = payload
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
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  }
}
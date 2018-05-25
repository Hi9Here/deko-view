import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedExercises: [{
        imageUrl: 'http://cdn2.coachmag.co.uk/sites/coachmag/files/2017/05/bench-press_0.jpg',
        id: 'cdfgshdjf',
        title: 'Chest Press',
        freq: 3
      },
      {
        imageUrl: 'http://www.ibodz.com/files/exerciseimages/abdominal-crunch-with-raised-legs-1.JPG',
        id: 'fgdhfj',
        title: 'Ab Crunch',
        freq: 2
      }
    ],
    user: {
      id: 'fdsghj',
      registeredExercsies: ['fgdhfj']
    }
  },
  mutations: {
    createExercise(state, payload) {
      state.loadedExercises.push(payload)
    }
  },
  actions: {
    createExercise({ commit }, payload) {
      const exercise = {
          title: payload.title,
          freq: payload.freq,
          imageUrl: payload.imageUrl,
          description: payload.description,
          id: 'dwefgdhdjg'
        }
        // Reach out to Firebase and store it
      commit('createExercise', exercise)
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
    }
  }
})
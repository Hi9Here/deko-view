import * as firebase from 'firebase'

export default {
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
}
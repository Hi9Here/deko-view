import Vue from 'vue'
import Vuex from 'vuex'
import exercise from './exercise'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    exercise: exercise,
    user: user,
    shared: shared
  }
})
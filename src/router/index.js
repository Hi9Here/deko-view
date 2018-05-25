import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Exercises from '@/components/exercise/Exercises'
import CreateExercise from '@/components/exercise/CreateExercise'
import Exercise from '@/components/exercise/Exercise'
import Profile from '@/components/user/Profile'
import Signin from '@/components/user/Signin'
import Signup from '@/components/user/Signup'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/exercises',
      name: 'Exercises',
      component: Exercises
    },
    {
      path: '/exercises/new',
      name: 'CreateExercise',
      component: CreateExercise
    },
    {
      path: '/exercises/:id',
      name: 'Exercise',
      props: true,
      component: Exercise
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/Signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/Signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
})
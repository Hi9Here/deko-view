<template>
  <v-app>
      <v-navigation-drawer clipped temporary app v-model="drawer">
        <v-list>
          <v-list-tile 
          v-for="item in menuItems" 
          :key="item.title"
          router
          :to="item.link">
            <v-list-tile-action>
              <v-icon>{{ item.icon}}</v-icon>
            </v-list-tile-action>
              <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    <v-toolbar dark class="red darken-2">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Deko Fit</router-link>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn 
        flat 
        v-for="item in menuItems" 
        :key="item.title"
        router
        :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      menuItems: [
        { icon: 'fitness_center', title: 'Exercises', link: '/exercises'},
        { icon: 'room', title: 'New Exercise', link: 'exercises/new'},
        { icon: 'person', title: 'Profile', link: '/profile'},
        { icon: 'face', title: 'Sign Up', link: 'signup'},
        { icon: 'lock_open', title: 'Sign In', link: 'signin'}
      ]
    }
  }
}
</script>

<template>
  <v-app>
      <v-navigation-drawer clipped temporary app v-model="drawer">
        <v-list>
          <v-list-tile 
          v-for="item in menuItems" 
          :key="item.title"
          :to="item.link">
            <v-list-tile-action>
              <v-icon>{{ item.icon}}</v-icon>
            </v-list-tile-action>
              <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile 
          v-if="userIsAuthenticated" 
          @click="onLogout">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
              <v-list-tile-content>Logout</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    <v-toolbar dark class="red darken-2">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Deko</router-link>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn 
        flat 
        v-for="item in menuItems" 
        :key="item.title"
        :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}</v-btn>
        <v-btn 
        v-if="userIsAuthenticated"
        flat
        @click="onLogout">
          <v-icon left>exit_to_app</v-icon>
          Logout</v-btn>
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
    }
  },
  computed: {
    menuItems () {
      let  menuItems = [
        { icon: 'face', title: 'Sign Up', link: 'signup'},
        { icon: 'lock_open', title: 'Sign In', link: 'signin'}
      ]
      if (this.userIsAuthenticated) {
        menuItems =  [
        { icon: 'perm_media', title: 'Exercise', link: '/exercises'},
        { icon: 'add_to_photos', title: 'New Exercise', link: 'exercises/new'},
        { icon: 'person', title: 'Profile', link: '/profile'},
        ]     
      }
      return menuItems
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

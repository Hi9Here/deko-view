<template>
  <v-app>
    <v-toolbar dark class="red darken-2">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Deko Fit</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>
      <v-navigation-drawer v-model="drawer">
        <v-list>
          <v-list-tile v-for="item in menuItems" :key="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon}}</v-icon>
            </v-list-tile-action>
              <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    <main>

    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      menuItems: [
        { icon: 'fitness_center', title: 'Exercises'},
        { icon: 'room', title: 'New Exercise'},
        { icon: 'person', title: 'Profile'},
        { icon: 'face', title: 'Sign Up'},
        { icon: 'lock_open', title: 'Sign In'}
      ]
    }
  }
}
</script>

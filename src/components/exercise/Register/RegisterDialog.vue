<template>
  <v-dialog persistent v-model="registerDialog">
    <v-btn accent slot="activator">
      {{  userIsRegistered ? 'Unregister' : 'Register'}}
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title v-if="userIsRegistered">UnFavorite this Exercise?</v-card-title>
            <v-card-title v-else>Favorite this Exercise?</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>You can always change this later</v-card-text>
        </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn 
              flat
              @click="registerDialog = false">Cancel</v-btn>
              <v-btn
              flat
              @click="onAgree">Confirm</v-btn>
            </v-card-actions>
        </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['exerciseId'],
    data () {
      return {
        registerDialog: false
      }
    },
    computed: {
      userIsRegistered () {
        return this.$store.getters.user.registeredExercises.findIndex(exerciseId => {
          return exerciseId === his.exerciseId
        }) >= 0
      }
    },
    methods: {
      onAgree () {
        if (this.userIsRegistered) {
          this.$store.dispatch('unregisterUserForExercise', this.exerciseId)       
        } else {
          this.$store.dispatch('registerUserForExercise', this.exerciseId)       
        }
      }
    }
  }
</script>

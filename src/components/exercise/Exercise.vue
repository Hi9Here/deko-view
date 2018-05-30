<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs-12 class="text-xs-center">
        <v-progress-circular 
          indeterminate 
          color="primary"
          :width="7"
          :size="70"
          v-if="loading">
        </v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h2>{{ exercise.title }}</h2>
            <template v-if="isAccounttrue">
              <v-spacer></v-spacer>
              <app-edit-exercise-details-dialog :exercise="exercise"></app-edit-exercise-details-dialog>
            </template>
          </v-card-title>
            <v-card-media
                  class="white--text"
                  height="400px"
                  :src="exercise.imageUrl"
                >
            </v-card-media>
            <v-card-text>
              <div>
                {{ exercise.description }}
              </div>
              <div>
                {{ exercise.muscle }}
              </div>
              <div>
                {{ exercise.account }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <app-exercise-register-dialog 
              :exerciseId="exercise.id"
              ></app-exercise-register-dialog>
            </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      exercise () {
        return this.$store.getters.loadedExercise(this.id)
      },
      isAccount () {
        return this.exercise.account !== null && this.exercise.account !== undefined
      },
      isAccounttrue () {
        if (!this.isAccount) {
          return false
        }
        return this.exercise.account === 'serene'
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>

<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h2>{{ exercise.title }}</h2>
          </v-card-title>
            <v-card-media
                  class="white--text"
                  height="400px"
                  :src="exercise.imageUrl"
                >
            </v-card-media>
            <v-card-text>
              <div>
                Push bar up and down
              </div>
              <div>
                Frequency {{ exercise.freq }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn>Register</v-btn>
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
      }
    }
  }
</script>

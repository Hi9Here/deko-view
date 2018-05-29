<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 md8 sm10 offset-sm1 offser-md2>
        <v-card dark class="blue darken-2" v-for="exercise in exercises" :key="exercise.id">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-card-media
                  class="white--text"
                  height="130px"
                  :src="exercise.imageUrl"
                >
                </v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title>
                  <div>
                    <div>
                      <h3>{{ exercise.title }}</h3>
                      <span>Frequency {{ exercise.freq }}</span><br>
                      <span>Account {{ exercise.account }}</span><br>
                      <span>Body Part {{ exercise.muscle }}</span><br>
                    </div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat :to="'/exercises/' + exercise.id">
                    <v-icon left light>arrow_forward</v-icon>
                    View Exercise
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      exercises () {
        return this.$store.getters.loadedExercises
      }
    }
  }
</script>
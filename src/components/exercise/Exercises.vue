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
                  height="150px"
                  :src="exercise.imageUrl"
                >
                </v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title>
                  <div>
                    <div>
                      <h2>{{ exercise.title }}</h2>
                    </div>
                  </div>
                </v-card-title>
                <v-card-text>
                      <h3>{{ exercise.muscle }}</h3>
                      <h3>Freq {{ exercise.freq }}</h3>
                </v-card-text>
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

<style scoped>
  h2 {
    font-weight: 300;
  }
  h3 {
    font-weight: 300;
  }
  .card__title {
    padding: 0px 20px 0px 16px;
  }
  @media only screen and (max-width: 599px){
    .container {
        padding: 12px 10px 0px 10px;
        margin: 0px 0px 5px 0px;
  }
  }


</style>

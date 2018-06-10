<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/exercises" dark class="blue darken-2">Explore Exercise</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left"> 
        <v-btn large router to="/exercises/new" dark class="blue darken-2">Create Exercise</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
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
    <v-layout row wrap class="mt-2" v-if="!loading">
      <v-flex xs12>
        <v-carousel style="cursor: pointer;">
          <v-carousel-item 
            v-for="exercise in exercises" 
            :src="exercise.imageUrl" 
            :key="exercise.id"
            @click.native="onLoadExercise(exercise.id)">
            <div class="title">
                {{ exercise.title }}
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Join the Exercise</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      exercises () {
        return this.$store.getters.featuredExercises
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadExercise (id) {
        this.$router.push('/exercises/' + id)
      } 
    }
  }
</script>

<style scoped>
  .title {
    position: absolute;
    bottom: 50px;
    background-color: rgba(0,0,0,.5);
    color: white;
    font-size: 2em;
    padding: 20px;
  }
</style>


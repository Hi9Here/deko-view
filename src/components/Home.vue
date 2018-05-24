<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/exercises" dark class="blue darken-2">Explore Exercises</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left"> 
        <v-btn large router to="/exercises/new" dark class="blue darken-2">Create Exercise</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item 
          v-for="exercise in exercises" 
          :src="exercise.imageUrl" 
          :key="exercise.id">
          <div class="title">
              {{ exercise.title }}
          </div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Join the Exercises</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        exercises: [
          { imageUrl: 'http://cdn2.coachmag.co.uk/sites/coachmag/files/2017/05/bench-press_0.jpg', id: 'cdfgshdjf', title: 'Chest Press'},
          { imageUrl: 'http://www.ibodz.com/files/exerciseimages/abdominal-crunch-with-raised-legs-1.JPG', id: 'fgdhfj', title: 'Ab Crunch'}
        ]
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


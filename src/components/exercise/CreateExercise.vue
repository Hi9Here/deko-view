<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Create a New Exercise</h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateExercise">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
              name="title"
              label="Title"
              id="title"
              v-model="title"
              required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
              name="freq"
              label="Freq"
              id="freq"
              v-model="freq"
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
              name="imageUrl"
              label="Image Url"
              id="image-url"
              v-model="imageUrl"
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
            <img :src="imageUrl" alt="" style="height: 200px">
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
              name="muscle"
              label="Body Part"
              id="muscle"
              v-model="muscle"
              required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
              name="description"
              label="Description"
              id="description"
              v-model="description"
              multi-line
              required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn 
              :disabled="formValid"
              type="submit">Create Exercise</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        freq: 0,
        imageUrl: '',
        muscle: '',
        description: ''
      }
    },
    computed: {
      formValid () {
        if (this.title.length > 3 && this.description.length > 3) {
        return false;
      } else {
        return true;
      }
    }
    },
    methods: {
      onCreateExercise () {
        const exerciseData = {
          title: this.title,
          freq: this.freq,
          imageUrl: this.imageUrl,
          muscle: this.muscle,
          description: this.description
        }
        console.log(exerciseData);
        this.$store.dispatch('createExercise', exerciseData )
        this.$router.push('/exercises')
      }
    }
  }
</script>
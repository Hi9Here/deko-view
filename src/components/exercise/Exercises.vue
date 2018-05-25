<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 md8 sm10 offset-sm1 offser-md2>
        <v-card dark class="blue darken-2">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-card-media
                  class="white--text"
                  height="130px"
                  src="http://cdn2.coachmag.co.uk/sites/coachmag/files/2017/05/bench-press_0.jpg"
                >
                  <v-container fill-height fluid>
                    <v-layout fill-height>
                      <v-flex xs12 align-end flexbox>
                        <span class="headline">Top 10 Australian beaches</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title>
                  <div>
                    <div>
                      <h3>Chest Press</h3>
                      <span>Up and Down</span><br>
                      <span>Quite Hard</span>
                    </div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat to="/exercises/1">
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
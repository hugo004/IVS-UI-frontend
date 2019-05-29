<template>
  <v-container
    fliud
    grid-list-xl
    fill-height
  >
    <v-layout column>
      <v-flex>
        <span class="heading">Authorize Resource</span>
        <v-btn 
          color="green"
          dark
          right
          absolute
          outline
        >
          <v-icon>fas fa-file-alt</v-icon>
          <span class="heading px-2">Request Access Resource</span>
        </v-btn>
      </v-flex>
      <v-flex>
        <material-card>
          <template slot="header">
            <v-select 
              :items="authorizedPeople"
              label="Authorize people"
              color="white"
              :loading="loading"
              solo
              dark
            />
          </template>
          <v-tabs
            dark
            icons-and-text
            show-arrows
            color="primary"
          >
            <v-tabs-slider color="white"></v-tabs-slider>
            
            <v-tab 
              v-for="(tab, index) in assetCategory" 
              :key="index"
              :href="`#tab-${index}`"
            >
             {{ tab }}
            </v-tab>

            <v-tab-item
              v-for="i in assetCategory.length" 
              :key="i"
              :value="`tab-${i-1}`"
            >
              <v-card>
                <v-card-text>
                  <v-data-table
                    :headers="tableHeader"
                    :items="[]"
                  ></v-data-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { 
  GetAllRegistryAsset,
  GetSentRequestList
} from '@/api/asset.js'

export default {
  name: 'RecordPermission',

  data: () => ({
    tableHeader: [],
    authorizedPeople: [],
    assetCategory: [],
    loading: false
  }),

  async mounted() {
    //get all defined resource type in network
    await this.getAllRegistryAsset();

    //table header equalt to resource category type

    //authorized people
    await this.fetchAuthorizePeople();
  },

  methods: {
    async getAllRegistryAsset() {
      try {
        this.$store.commit('setLoading', true);
        this.assetCategory = await GetAllRegistryAsset().then((result) => {
          let integrated = [];
          result.forEach(e => {
            let name = e.split('.');
            name = name[name.length - 1];
            integrated.push(name);
          });

          return integrated;
        });
        this.$store.commit('setLoading', false);
      }
      catch (error) {
        this.$store.commit('setLoading', false);
        this.$store.commit('showError', error);
      }
    },

    async fetchAuthorizePeople() {
      try {
        this.loading = true;
        this.authorizedPeople = await GetSentRequestList().then(result => {
          let authorized = [];
          //get ACCEPT reqeust item, it the people authorize me, so put them on the list
          result.forEach(e => {
            if (e.status == 'ACCEPT') {
              if (!authorized.includes(e.senderName)) {
                authorized.push(e.senderName);
              }
            }
          });

          return authorized;
        });
        this.loading = false;
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },
  }
}
</script>

<style>

</style>

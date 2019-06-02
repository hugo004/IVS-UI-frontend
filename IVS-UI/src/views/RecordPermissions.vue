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
              :items="authorizeItem"
              itemText="name"
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
            <!-- the category display authorize item only -->
            <v-tab 
              v-for="(tab, index) in authorizedData.keys()" 
              :key="index"
              :href="`#tab-${index}`"
            >
             {{ tab }}
            </v-tab>

            <v-tab-item
              v-for="(key, i) in authorizedData.keys()" 
              :key="i"
              :value="`tab-${i}`"
            >
              <v-card>
                <v-card-text>
                  <v-data-table
                    :headers="tableHeader(key)"
                    :items="tableItems(key)"
                  >
                    <template v-slot:items="props">
                      <tr v-html="tableData(key, props.item)"></tr>
                    </template>
                  </v-data-table>
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
  GetSentRequestList,
  GetAsset
} from '@/api/asset.js'

export default {
  name: 'RecordPermission',

  data: () => ({
    authorizeItem: [],
    assetCategory: [],
    loading: false,
    
    //education
    educationHeaders: [
      {
        text: 'School',
        value: 'school',
        sortable: false
      },

      {
        text: 'Major',
        value: 'major',
        sortable: false
      },

      {
        text: 'From',
        value: 'from',
        sortable: false
      },

      {
        text: 'To',
        value: 'to',
        sortable: false
      }
    ],

    //work exp
    workExpHeaders: [
      {
        text: 'Name',
        value: 'cname',
        sortable: false
      },

      {
        text: 'From',
        value: 'workfrom',
        sortable: false
      },

      {
        text: 'To',
        value: 'workto',
        sortable: false
      },

      {
        text: 'Job Title',
        value: 'job',
        sortable: false
      },

      {
        text: 'Skill',
        value: 'jobs kill',
        sortable: false
      },

      {
        text: 'Job Duty',
        value: 'jobduty',
        sortable: false
      },
    ],

    //vomlunteer record
    volunteerHeaders: [
      {
        text: 'Event Name',
        value: 'evetn name',
        sortable: false
      },

      {
        text: 'Hold By',
        value: 'holde by',
        sortable: false
      },

      {
        text: 'Description',
        value: 'desc',
        sortable: false
      }
    ],

    authorizedData: new Map()
  }),

  async mounted() {
    //get all defined resource type in network
    await this.getAllRegistryAsset();

    //authorized people
    await this.fetchAuthorizeItem();
  },

  methods: {
    tableHeader(key) {
      return this.authorizedData.get(key).headers || [];
    },

    tableItems(key) {
      return this.authorizedData.get(key).items || [];
    },

    tableData(name, item) {
      if (name == 'Education') {
        return `
          <td>${item.info.school}</td>
          <td>${item.info.major}</td>
          <td>${item.info.to}</td>
          <td>${item.info.from}</td>
        `;
      }
      else if (name == 'WorkExp') {
        return `
          <td>${item.info.company}</td>
          <td>${item.info.jobTitle}</td>
          <td>${item.info.jobDuty}</td>
          <td>${item.info.from}</td>
          <td>${item.info.to}</td>
        `;
      }
      else if (name == 'VolunteerRecord') {
        return ``;
      }

      return '';
    },

    async getAllRegistryAsset() {
      try {
        this.$store.commit('setLoading', true);
        this.assetCategory = await GetAllRegistryAsset().then((result) => {
          let integrated = [];
          result.forEach(e => {
            let name = e.split('.');
            name = name[name.length - 1];

            //not display the reqeust asset, it display in notification page
            // record asset is for profile page
            if (name != 'Request' && name != 'Record') {
              integrated.push(name);
            }
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

    async fetchAuthorizeItem() {
      try {
        this.loading = true;

        //fetech authorize item
        this.authorizeItem = await GetSentRequestList().then(result => {
          let authorized = [];
          //get ACCEPT reqeust item, it the people authorize me, so put them on the list
          result.forEach(e => {
            if (e.status == 'ACCEPT') {
              if (!authorized.includes(e.senderName)) {
                authorized.push({
                  'name': e.receiverName,
                  'assetName': e.assetName,
                  'assetIds': e.requested,
                  'items': []
                });
              }
            }
          });

          return authorized;
        });

        //put authorize item into different cateogry
        for (let i=0; i<this.authorizeItem.length; i++) {
          let item = this.authorizeItem[i];
            const {assetName, assetIds} = item;

            let itemList =  await GetAsset({
              'assetName': assetName,
              'assetIds': assetIds
            });

            //decreapted
            // item.items = itemList;

            //add the talbe header for display
            let headers = [];
            if (assetName == 'Education') {
              headers = this.educationHeaders;
            }
            else if (assetName == 'WorkExp') {
              headers = this.workExpHeaders;
            }
            else if (assetName == 'VolunteerRecord') {
              headers = this.volunteerHeaders;
            }

            this.authorizedData.set(assetName, {
              'category': assetName,
              'headers': headers,
              'items': itemList
            });

        }

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

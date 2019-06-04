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
          @click="dialog=true"
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
              itemText="owner"
              label="Authorize people"
              color="white"
              :loading="loading"
              solo
              dark
              return-object
              @change="selectAuthorizeData"
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

    <!-- request access form -->
    <v-dialog v-model="dialog">
      <v-form
        v-model="isValid"
        lazy-validation
      >
      <v-card>
        <v-card-title class="title">Request Access Asset Form</v-card-title>
        <v-card-text>
          <v-text-field 
            v-model="newRequest.eventName"
            :rules="requiredRule"
            label="Event Name"
          />

          <v-combobox 
            v-model="newRequest.receiverId"
            :rules="requiredRule"
            label="Receiver Id"
          />

          <v-text-field 
            v-model="newRequest.receiverName"
            :rules="requiredRule"
            label="Receiver Name"
          />

          <v-select 
            v-model="newRequest.assetName"
            :items="assetCategory"
            :rules="requiredRule"
            label="Asset Name"
          />

          <v-combobox 
            v-model="newRequest.assetId"
            :rules="requiredRule"
            label="Asset Id"
            multiple
          />

          <v-textarea 
            v-model="newRequest.remarks"
            label="Remarks"
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outline
          >
            cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="createLoading"
            @click="createNewRequest()"
          >
            reqeust
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import { 
  GetAllRegistryAsset,
  GetSentRequestList,
  GetAsset,
  RequestAccessAsset
} from '@/api/asset.js'

import mixin from './js/mixins.js';

export default {
  name: 'RecordPermission',
  
  mixins: [mixin],

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

      // {
      //   text: 'Skill',
      //   value: 'jobs kill',
      //   sortable: false
      // },

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

    authorizedData: new Map(),

    //create request info
    newRequest: {
      'receiverId': '',
      'receiverName': '',
      'eventName': '',
      'remarks': '',
      'assetId': [],
      'assetName': ''
    },
    createLoading: false,
    dialog: false,
    isValid: true
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

    dataTimeString(dateString) {
      return new Date(dateString).toLocaleDateString();
    },

    tableData(name, item) {
      if (name == 'Education') {
        return `
          <td>${item.info.school}</td>
          <td>${item.info.major}</td>
          <td>${this.dataTimeString(item.info.to)}</td>
          <td>${this.dataTimeString(item.info.from)}</td>
        `;
      }
      else if (name == 'WorkExp') {
        return `
          <td>${item.info.company}</td>
          <td>${this.dataTimeString(item.info.to)}</td>
          <td>${this.dataTimeString(item.info.from)}</td>
          <td>${item.info.jobTitle}</td>
          <td>${item.info.jobDuty}</td>
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
        let authoirzedList = await GetSentRequestList().then(result => {
          let authorized = [];
          //get ACCEPT reqeust item, it the people authorize me, so put them on the list
          result.forEach(e => {
            if (e.status == 'ACCEPT') {
              if (!authorized.includes(e.senderName)) {
                authorized.push({
                  'owner': e.receiverName,
                  'assetName': e.assetName,
                  'assetIds': e.requested,
                  'ownerData': new Map()
                });
              }
            }
          });

          return authorized;
        });

        //put authorize item into different cateogry
        let authorizedItems = [];
        for (let i=0; i<authoirzedList.length; i++) {
          let item = authoirzedList[i];
            const {assetName, assetIds, owner} = item;

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

            let ownerData = new Map();
            ownerData.set(assetName, {
              'category': assetName,
              'headers': headers,
              'items': itemList
            });

            //put same owner data in to array
            let index = -1;
            //get the index of authorized owner
            for (let i in authorizedItems) {
              let item = authorizedItems[i];
              if (item.owner == owner) {
                index = i;
              }
            }
            
            if (index > -1) {
              let item = authorizedItems[index];
              //if same, merge the map
              item.data = new Map([...item.data, ...ownerData]);
            }
            else {
              authorizedItems.push({
                owner: owner,
                data: ownerData
              });
            }

        }

        this.authorizeItem = authorizedItems;
        this.loading = false;

      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async createNewRequest() {
      try {
        if (this.isValid) {
          this.createLoading = true;
          await RequestAccessAsset(this.newRequest);
          this.createLoading = false;
          this.$store.commit('showSuccess', 'Request sent');
          this.dialog = false;
        }
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.createLoading = false;
      }
    },

    async fetchReceiverList() {
      //get all register user

      //for display in the receiver field (name, id like github invite member)
    },

    selectAuthorizeData(val) {
      this.authorizedData = val.data;
    }
  }
}
</script>

<style>

</style>

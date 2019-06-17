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
        <!-- <material-card>
          <template slot="header">
            <v-select 
              :items="authorizeItem"
              itemText="owner"
              label="Authorize people"
              color="black"
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
        </material-card> -->
        <ivs-authorized-table 
          :tableData="authorizedData"
        >
          <template slot="header">

            <v-select 
              :items="authorizeItem"
              itemText="owner"
              label="Authorize people"
              color="black"
              :loading="loading"
              solo
              dark
              return-object
              @change="selectAuthorizeData"
            />
          </template>
        </ivs-authorized-table>
      </v-flex>

      <v-flex>
        <ivs-authorized-table 
          :tableData="myAuthorizedAsset"
          @click="onAssetRevoke"
          show-action
        >
          <template slot="header">
            <v-layout align-center>
              <v-flex>
                <span class="text-capitalize">Revoke my granted asset</span>
              </v-flex>
            </v-layout>

            <v-select 
              class="text-capitalize"
              :items="myAuthenUserList"
              item-text="name"
              label="Granted to"
              color="white"
              solo
              dark
              return-object
              @change="viewMyAuthenInfo"
              :loading="myAuthenAssetLoading"
            />
          </template>
        </ivs-authorized-table>
      </v-flex>
    </v-layout>

    <!-- request access form -->
    <v-dialog 
      v-model="dialog"
       max-width="800"
       persistent
      >
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
              label="*Event Name"
            />

            <v-combobox 
              v-model="selectedUser"
              :rules="[v => !!v]"
              :items="userList"
              item-text="baseInfo.userName"
              :loading="userLoading"
              label="*Select the receiver"
              return-object
              @change="onUserSelect"
            />

            <v-select 
              v-model="newRequest.assetName"
              :items="assetCategory"
              :rules="requiredRule"
              label="*Asset Name"
              @change="fetchUserAsset"
              :disabled="disableCateogry"
            />

            <v-combobox 
              v-model="selectedAssets"
              :rules="requiredRule"
              :items="assetList"
              item-text="name"
              :loading="assetLoading"
              chips
              label="Select asset"
              multiple
              @change="onAssetSelect"
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
              @click="dialog=false"
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
  RequestAccessAsset,
  GetAccessRequestList,
  RevokeAccessAsset,
  GetUserList,
  GetAssetList
} from '@/api/asset.js'

import mixin from './js/mixins.js';
import { mapState } from 'vuex';
import { userInfo } from 'os';

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
        text: 'GPA',
        value: 'gpa',
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
    isValid: true,

    //the asset my authorized to other person
    authorizedAsset: new Map(),
    myAuthenUserList: [],
    seletedUserInfo: {},
    myAuthenAssetLoading: false,

    //user list
    userLoading: false,
    userList: [],
    selectedUserId: '',
    selectedUser: [],

    //asset list
    assetList: [],
    assetLoading: false,
    selectedAssets: []
  }),

  async mounted() {
    //get all defined resource type in network
    await this.getAllRegistryAsset();

    //authorized people
    await this.fetchAuthorizeItem();

    this.fetchMyAuthorizedItem();

    this.getUserList();

    
  },

  computed: {
    ...mapState({
      headersMap: state => state.assetHeadersMap
    }),

    myAuthorizedAsset() {
      const {id} = this.seletedUserInfo;
      let myAsset = this.authorizedAsset.get(id);

      if (myAsset) {
        let assetMap = new Map();
        for (let field in myAsset) {
          assetMap.set(field, {
            'headers': this.headersMap.get(field),
            'items': myAsset[field]
          });
        }

        return assetMap;
      }
      
      return new Map();
    },

    disableCateogry() {
      if (this.selectedUserId.length > 0) {
        return false;
      }

      return true;
    }
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
          <td>${item.info.gpa}</td>
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
                  'assetIds': e.requested
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

    selectAuthorizeData(val) {
      this.authorizedData = val.data;
    },

    async fetchMyAuthorizedItem() {
      try {
        
        let _this = this;
        _this.myAuthorizedAsset.clear();
        _this.myAuthenAssetLoading = true;

        let authorizedData = await GetAccessRequestList('ACCEPT').then(result => {

          let requestList = result || [];
          let integratedMap = new Map();

          requestList.forEach(e => {
            //ignore channel invitation request
            if (e.requestType == 'CHANNEL') return;

            let obj = {
              'requestId': e.requestId
            };
            
            let key = e.senderId;
            
            //save same requester requestd asset together
            if (integratedMap.has(key)) {
              obj = integratedMap.get(key) || {};
              let assetList = obj[e.assetName] || [];

              if (assetList.length > 0) {
                assetList.push(...e.requested);
              }
              else {
                assetList.push(e.requested);
              }

              obj[e.assetName] = assetList;
              integratedMap.set(key, obj);
            }
            //for new requester
            else {
              obj[e.assetName] = e.requested;
              integratedMap.set(key, obj);
            }

            //put the user, i authen to on the select list
            let userInfo = {
              'name': e.senderName,
              'id': e.senderId
            };

            if (!_this.myAuthenUserList.includes(userInfo)) {
              _this.myAuthenUserList.push(userInfo);
            }

          });

          return integratedMap;

        });

        let authorizedMap = authorizedData;
        for (const [key, value] of authorizedMap.entries()) {
          let obj = {};

          for (let asset in value) {
            //ingore request id, it is for revoke api call
            if (asset == 'requestId') continue;

            let assetIds = value[asset];
            let assetList = await GetAsset({
              'assetName': asset,
              'assetIds': assetIds
            });

            //add request id to the asset for later revoke action
            assetList.forEach(e => {
              e['requestId'] = value['requestId'];
            });

            obj[asset] = assetList;
          }

          _this.authorizedAsset.set(key, obj);
        }

        _this.myAuthenAssetLoading = false;

      }
      catch (error) {
        this.$store.commit('showError', error);
        this.myAuthenAssetLoading = false;
      }
    },

    viewMyAuthenInfo(user) {
      if (user) {
        this.seletedUserInfo = user;
      }
    },

    async onAssetRevoke(assetInfo) {
      try {
        this.$store.commit('setLoading', true);

        const {$class, assetId, requestId} = assetInfo;

        let assetName = $class.split('.');
        assetName = assetName[assetName.length - 1];

        const {id} = this.seletedUserInfo;

        await RevokeAccessAsset({
          'assetName': assetName,
          'assetIds': [assetId],
          'requestId': requestId,
          'revokeUser': id
        });
        
        this.fetchMyAuthorizedItem();
        this.$store.commit('setLoading', false);
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async getUserList() {
      try {
        this.userLoading = true;
        this.userList = await GetUserList();
        this.userLoading = false;
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.userLoading = false;
      }
    },

    onUserSelect(val) {
      if (val) {
        this.newRequest.receiverId = val.userId;
        this.newRequest.receiverName = val.baseInfo.userName;
        this.selectedUserId = val.userId;

        this.selectedUser = val.baseInfo.userName;
      }
    },

    onAssetSelect(val) {
      if (val) {
        this.newRequest.assetId = val.map(e => e.assetId);
      }
    },

    async fetchUserAsset(assetName) {
      if (this.selectedUserId) {
        this.assetLoading = true;

        this.assetList = await GetAssetList({
          'assetName': assetName,
          'userId': this.selectedUserId
        });

        this.assetLoading = false;
      }

    }

  }
}
</script>

<style>

</style>

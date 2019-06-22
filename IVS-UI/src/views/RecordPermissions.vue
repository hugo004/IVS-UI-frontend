<template>
  <v-container
    fliud
    grid-list-xl
    fill-height
  >
    <v-layout column>
      <v-flex>
        <ivs-authorized-table 
          :tableData="authorizedData"
        >
          <template slot="header">
            <v-layout align-center>
              <v-flex xs8>
                <span class="text-capitalize">Authorize Resource</span>
              </v-flex>
              <v-flex class="text-xs-right px-0">
                <v-btn 
                  color="primary"
                  dark
                  right
                  round
                  @click="dialog=true"
                >
                  <v-icon>fas fa-file-alt</v-icon>
                  <span class="heading px-2">Request Access Resource</span>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-select 
              :items="authorizeItem"
              itemText="owner"
              label="Authorize people"
              color="black--text white"
              :loading="loading"
              solo
              dark
              return-object
              @change="selectAuthorizeData"
            >
              <template slot="append-outer">
                <v-btn
                  class="pa-0 ma-0"
                  dark
                  flat
                  icon
                  small
                  @click="fetchAuthorizeItem()"
                >
                  <v-icon>refresh</v-icon>
                </v-btn>
              </template>
            </v-select>
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
              <v-flex xs8>
                <span class="text-capitalize">Revoke my granted asset</span>
              </v-flex>
              <v-flex class="text-xs-right px-0">
                <v-btn 
                  color="primary"
                  dark
                  right
                  round
                  @click="grantPermissionDialog()"
                >
                  <v-icon>fas fa-lock-open</v-icon>
                  <span class="heading px-2">grant access permission</span>
                </v-btn>
              </v-flex>
            </v-layout>

            <v-select 
              class="text-capitalize"
              :items="myAuthenUserList"
              item-text="name"
              label="Granted to"
              color="black--text white"
              solo
              dark
              return-object
              @change="viewMyAuthenInfo"
              :loading="myAuthenAssetLoading"
            >
              <template slot="append-outer">
                <v-btn
                  class="pa-0 ma-0"
                  dark
                  flat
                  icon
                  small
                  @click="fetchMyAuthorizedItem()"
                >
                  <v-icon>refresh</v-icon>
                </v-btn>
              </template>
            </v-select>
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
        <template v-if="isGrantPermission">
          <v-card>
            <v-card-title class="title">Grant Record Access Permission</v-card-title>
            <v-card-text>


              <v-select 
                v-model="newRequest.assetName"
                :items="assetCategory"
                :rules="requiredRule"
                label="*Asset Name"
                @change="getUserAsset"
              />

              <v-combobox 
                ref="assetList"
                key="assetList"
                v-model="selectedAssets"
                :rules="requiredRule"
                :items="assetList"
                item-text="name"
                item-value="assetId"
                :loading="assetLoading"
                chips
                label="Select asset"
                multiple
                @change="onAssetSelect"
              />

              <v-combobox 
                key="userList"
                v-model="selectedUser"
                :rules="[v => !!v]"
                :items="userList"
                item-text="baseInfo.userName"
                :loading="userLoading"
                label="*Select the receiver"
                return-object
                @change="onUserSelect"
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
                @click="dialog=false, isGrantPermission=false"
              >
                cancel
              </v-btn>
              <v-btn
                color="primary"
                :loading="createLoading"
                @click="createNewRequest()"
              >
                grant
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>

        <template v-else>
          <v-card>
            <v-card-title class="title">Request Access Asset Form</v-card-title>
            <v-card-text>
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
                :disabled="disableCateogry"
                @change="onCategoryChange"
                :loading="assetLoading"
              />

              <v-combobox 
                ref="assetList"
                v-model="selectedAssets"
                :rules="requiredRule"
                :items="assetList"
                item-text="name"
                item-value="assetId"
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
        </template>
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
  GetAssetList,
  GetMyProfile
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
    receiverAssets: {},

    //asset list
    assetList: [],
    assetLoading: false,
    selectedAssets: [],

    //grant permission
    isGrantPermission: false
  }),

  async mounted() {
    //get all defined resource type in network
    await this.getAllRegistryAsset();

    //authorized people
    await this.fetchAuthorizeItem();

    await this.fetchMyAuthorizedItem();

    await this.getUserList();

    
  },

  computed: {
    ...mapState({
      headersMap: state => state.assetHeadersMap,
      myProfile: state => state.myProfile
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

  watch: {
    dialog(val) {
      if (val) {
        this.resetData();
      }
    }
  },

  methods: {
    resetData() {
      this.selectedAssets = [];
      this.seletedUserInfo = {};
      this.selectedUserId = '';
      this.selectedUser = [];
      this.assetList = [];
      
      this.newRequest = {
        'receiverId': '',
        'receiverName': '',
        'eventName': '',
        'remarks': '',
        'assetId': [],
        'assetName': ''
      }
    },

    tableHeader(key) {
      return this.authorizedData.get(key).headers || [];
    },

    tableItems(key) {
      return this.authorizedData.get(key).items || [];
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
            if (name != 'Request') {
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
        this.authorizedData = new Map();
        this.loading = true;
  
        //fetech authorize item
        let grantedList = await GetAccessRequestList('GRANT').then(result => {
          //exchange the sender and receiver filed value
          result.forEach(e => {
            const {receiverId, receiverName, senderId, senderName} = e;
            e['receiverId'] = senderId;
            e['receiverName'] = senderName;
            e['senderId'] = receiverId;
            e['senderName'] = receiverName;
          });
          
          return result;
        });

        let authoirzedList = await GetSentRequestList('ACCEPT').then(result => {
          let authorized = [];
          //get ACCEPT reqeust item, it the people authorize me, so put them on the list
          let list = result || [];
          list.push(...grantedList);

          list.forEach(e => {
            if (!authorized.includes(e.senderName)) {
              authorized.push({
                'owner': e.receiverName,
                'assetName': e.assetName,
                'assetIds': e.requested
              });
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


            let ownerData = new Map();
            ownerData.set(assetName, {
              'category': assetName,
              'headers': this.headersMap.get(assetName),
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
              //if same owner, merge the items
              let mergeItems = [...item.data.get(assetName).items, ...ownerData.get(assetName).items];
              item.data.get(assetName).items = mergeItems;
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
          
          if (this.isGrantPermission) {
            //default name when grant action
            this.newRequest.eventName = 'Grant Record Permission';
            await RequestAccessAsset(this.newRequest, 'GRANT');
            this.$store.commit('showSuccess', 'Access Permission Granted');
          }
          else {
            this.newRequest.eventName = 'Request Record Access Permission'
            await RequestAccessAsset(this.newRequest);
            this.$store.commit('showSuccess', 'Request sent');
          }
          this.createLoading = false;

          this.dialog = false;
          this.isGrantPermission = false;
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
        _this.myAuthenUserList = [];

        //get my granted record
        let grantedList = await GetSentRequestList('GRANT').then(result => {
          //exchange the sender and receiver filed value
          result.forEach(e => {
            const {receiverId, receiverName, senderId, senderName} = e;
            e['receiverId'] = senderId;
            e['receiverName'] = senderName;
            e['senderId'] = receiverId;
            e['senderName'] = receiverName;
          });

          return result;
        });

        let authorizedData = await GetAccessRequestList('ACCEPT').then(result => {

          let requestList = result || [];
          requestList.push(...grantedList);
          
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

        //reset asset name when re-select user
        if (!this.isGrantPermission) {
          this.newRequest.assetName = '';
          this.selectedAssets = [];
          this.fetchUserAsset();
        }
      }
    },

    onAssetSelect(val) {
      if (val) {
        this.newRequest.assetId = val.map(e => e.assetId);
      }
    },

    async fetchUserAsset() {
      this.selectedAssets = [];

      if (this.selectedUserId) {
        if (!this.receiverAssets[this.selectedUserId]) {

          this.assetLoading = true;
          let assets = await GetAssetList({
            'assetName': 'Record',
            'userId': this.selectedUserId
          });
          
          //classfy record into response record type
          let userRecord = {}
          this.assetCategory.forEach(type => {
            let filtered = assets.filter(record => record.recordType == type);
            
            //save no empty list only
            if (filtered.length > 0) {
              userRecord[type] = filtered
            }
          });

          this.receiverAssets[this.selectedUserId] = userRecord;
          this.assetLoading = false;
        }
      }

      let category = [];
      let records = this.receiverAssets[this.selectedUserId];
      for (let field in records) {
        category.push(field);
      }

      this.assetCategory = category;
    },

    onCategoryChange(val) {
      if (val) {
        let record = this.receiverAssets[this.selectedUserId];
        this.assetList = record[val];
        this.openAssetListMenu();
      }
    },
    

    async fetchMyProfile() {
      try {
        if (!this.myProfile) {
          this.$store.commit('setLoading', true);

          let _this = this;
          await GetMyProfile().then(result => {
            let map = new Map();
            for (let field in result) {
              map.set(field, {
                headers: _this.headersMap.get(field),
                items: result[field]
              })
            }
            this.$store.commit('setProfile', map);
            return map;
          });
          this.$store.commit('setLoading', false);
        }

        this.assetCategory = [...this.myProfile.keys()];
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async grantPermissionDialog() {
      await this.fetchMyProfile();
      this.dialog = true;
      this.isGrantPermission = true;
    },

    getUserAsset(assetName) {
      this.selectedAssets = [];
      this.assetList = this.myProfile.get(assetName).items;
      this.openAssetListMenu();
    },

    openAssetListMenu() {
      this.$nextTick(() => {
        this.$refs.assetList.focus();
        this.$refs.assetList.activateMenu();
      });
    }

  }
}
</script>

<style>

</style>

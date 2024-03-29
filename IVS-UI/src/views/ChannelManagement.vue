<template>
  <v-container 
  fluid 
  grid-list-xl 
  fill-height
  class="py-0"
  >
    <v-layout column>
      <v-flex>
        <span class="heading">My Channels</span>
        <v-btn 
          color="green"
          dark
          right
          absolute
          outline
          @click="dialog=true"
        >
          <v-icon>fas fa-users</v-icon>
          <span class="heading px-2">Create Channel</span>
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex 
            v-for="(channel,index) in myChannels"
            :key="index"
            sm4
            @click="viewChannel(channel)"
            class="channel-card"
          >
            <ivs-channel-card
              :channel="channel"
            >
              <template slot="header-actions">
                <v-btn
                  round
                  color="primary"
                  @click.stop="exitChannelDialog(channel)"
                >
                  exit
                </v-btn>
              </template>
            </ivs-channel-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <ivs-authorized-table
          v-if="showChannelInfo"
          :tableData="channelData"
        >
          <template slot="header">
            <v-layout align-center>
              <v-flex>
                <span class="title text-capitalize">{{ selectedChannel.name || ''}}'s record</span>
              </v-flex>
              <v-flex xs3 class="text-xs-right mx-2">
                <v-btn
                  round
                  color="primary"
                  class="elevation-1"
                  @click="addChannelAssetDialog()"
                >
                  add channel record
                </v-btn>
              </v-flex>
            </v-layout>
          <v-progress-linear :indeterminate="true" v-if="channelTableLoading" color="white" />
          </template>
        </ivs-authorized-table>
      </v-flex>
      
      <v-flex>
        <ivs-authorized-table
          v-if="showChannelInfo"
          :tableData="authorizedData"
        >

          <template slot="header">
            <v-layout align-center>
              <v-flex>
                <span class="title text-capitalize">{{ selectedChannel.name || ''}}</span>
              </v-flex>
              <v-flex xs3 class="text-xs-right">
                <v-btn
                  round
                  color="primary"
                  class="elevation-1"
                  @click="memberInviteForm()"
                >
                  invite member
                </v-btn>
              </v-flex>
            </v-layout>

            <v-select 
              class="text-capitalize"
              :items="channelMembers"
              itemText="baseInfo.userName"
              label="member"
              color="black"
              solo
              dark
              return-object
              @change="viewMember"
            />
          </template>
        </ivs-authorized-table>
      </v-flex>
    </v-layout>

    <v-dialog 
      v-model="dialog"
      persistent
      max-width="800"
    >
      <template v-if="inviteNewMember">
        <v-form
          ref="inviteForm"
          lazy-validation
        >
          <v-card>
            <v-card-title class="title">Invite New Member</v-card-title>
            <v-card-text>
              <v-layout column> 
                <v-combobox
                  :rules="requiredRule"
                  v-model="newMembers"
                  :items="invitableList"
                  itemText="baseInfo.userName"
                  :loading="userLoading"
                  return-object
                  multiple
                  chips
                  label="enter new member id/name e.g u-001/user001"
                >
                  <span slot="no-data" class="ma-4">no available member</span>
                </v-combobox>
                <v-textarea
                  v-model="inviteMessage"
                />
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                outline
                @click="dialog=false, inviteNewMember=false"
                > 
                  cancel
                </v-btn>
                <v-btn
                  color="green"
                  dark
                  :loading="inviteLoading"
                  @click="sendInvitation()"
                >
                  invite
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>

      <template v-else-if="isExitChannel">
        <v-card>
          <v-card-text>
            <div class="title my-3">Are you sure to exit the channel:</div>
            {{ selectedChannel.name || '' }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outline
              @click="cancelExit()"
            >
              cancel
            </v-btn>
            <v-btn
              color="primary"
              :loading="exitLoading"
              @click="exitChannel()"
            >
              confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <template v-else-if="isChannelAsset">
        <v-card>
          <v-card-text>
            <ivs-file-upload-form 
              ref="file"
              :show-verifier="false"  
            />
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              outline 
              @click="channelAssetDialogCancel()"
            >
              close
            </v-btn>

            <v-btn 
              color="primary" 
              @click="addChannelAsset()"
              :loading="channelLoading"
            >
              upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <template v-else>
        <ivs-channel-create-form 
          ref="form"
          v-model="newChannelInfo"
          :loading="userLoading"
          :itemList="userList"
        >
          <template slot="actions">
            <v-spacer></v-spacer>
            <v-btn
                outline
                @click="onCancel()"
              >
                cancel
            </v-btn>
            <v-btn 
              color="primary"
              :loading="createLoading"
              @click="onChannelCreate()"
            >
              create
            </v-btn>
          </template>
        </ivs-channel-create-form>
      </template>
    </v-dialog>

  </v-container>
</template>

<script>

import {
  GetUserChannel,
  CreateChannel,
  UploadChannelAsset,
  GetChannelAssets
} from '@/api/channel.js';


import { 
  GetAllRegistryAsset,
  GetSentRequestList,
  GetAsset,
  RequestAccessAsset,
  GetChannelMemberAssets,
  SendChannelInvitation,
  ExitChannel,
  GetUserList
} from '@/api/asset.js'

import mixin from './js/mixins.js';
import { mapState } from 'vuex';
import { error } from 'util';

export default {
  name: 'ChannelManagement',

  mixins: [mixin],

  data: () => ({
    dialog: false,
    createLoading: false,
    assetCategory: [],
    
    tableHeaders: [],
    tableItems: [],
    newChannelInfo: {
      'name': '',
      'members': []
    },


    showChannelInfo: false,

    channelAssets: {},
    selectedChannel: null,
    selectedMemberId: '',
    selectedMemberInfo: {},
    inviteNewMember: false,
    inviteLoading: false,
    inviteMessage: '',
    newMembers: [],

    //exit channel
    exitLoading: false,
    isExitChannel: false,

    //user list
    userLoading: false,
    userList: [],
    invitableList: [],

    //add channel asset
    isChannelAsset: false,
    channelLoading: false,
    channelData: new Map(),
    channelTableLoading: false

  }),

  mounted() {
    if (this.myChannels.length < 1) {
      this.fetchChannel();
    }

    this.getUserList();

  },

  computed: {
    ...mapState({
      headersMap: state => state.assetHeadersMap
    }),
    
    myChannels() {
      return this.$store.state.myChannels;
    },



    authorizedData() {
      let memberInfo = this.channelAssets[this.selectedMemberId];
      if (memberInfo) {

        let assetMap = new Map();
        for (let field in memberInfo) {
          assetMap.set(field, {
            'headers': this.headersMap.get(field),
            'items': memberInfo[field]
          });
        }

        return assetMap;
      }
      
      return new Map();
    },

    channelMembers() {
      if (this.selectedChannel) {
        //remove current login user from select choice
        let userInfoStr = localStorage.getItem('userInfo');
        let me = JSON.parse(userInfoStr).userId;

        let members = Object.assign([], this.selectedChannel.members);
        let index = -1;
        members.forEach(e => {
          if (e.userId == me) {
            index = members.indexOf(e);
            return;
          }
        });

        if (index > -1) {
          members.splice(index, 1);
        }
        
        return members;
      }
      
      return [];
    }
  },

  methods: {
    onCancel() {
      this.dialog = false;
    },

    async fetchChannel() {
      try {
        this.$store.commit('setLoading', true);
        await GetUserChannel().then((result) => {
          let integrated = [];
          //repalce the channel's member property from string id to member info (string[] with object[])
          result.forEach(e => {
            let {channel, membersInfo} = e;
            channel.members = membersInfo;
            integrated.push(channel);
          });

          this.$store.commit('setChannels', integrated);
        });

        this.$store.commit('setLoading', false);
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async onChannelCreate() {
      try{
        if (this.$refs.form.validate()) {

          const {name, members} = this.newChannelInfo;

          //get the members id
          let memberIds = members.map(e => e.userId);
          
          //call api and turn on loading effect
          this.createLoading = true;

          await CreateChannel({
            'name': name,
            'members': memberIds
          });

          this.createLoading = false;
          this.dialog = false;

          //display message
          this.$store.commit('showSuccess', 'Channel created');

          this.fetchChannel();
        }
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.createLoading = false;
      }
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
            // if (name != 'Request' || name != 'Record') {
              integrated.push(name);
            // }
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

    async viewChannel(channel) {
      try {
        if (!channel) return;
        this.selectedChannel = channel;
        this.showChannelInfo = true;
        this.$store.commit('setLoading', true);

        //get the channel member id and get members asset
        let memberIds = [];
        channel.members.forEach(element => {
          memberIds.push(element.userId);
        });

        //remove login user id from member id
        //login user no need to see own record in channel
        let index = -1;
        if (localStorage.getItem('userInfo')) {

          let userInfoStr = localStorage.getItem('userInfo');
          let userId = JSON.parse(userInfoStr).userId;

          index = memberIds.indexOf(userId);
        }

        if (index > -1) {
          memberIds.splice(index, 1);
        }

        //get channel members assets
        // this.channelAssets = await GetChannelMemberAssets(memberIds);
        this.$store.commit('setLoading', false);

        //make the invitable channel list, which exclude the current channel members
        this.invitableList = this.userList.filter(e => !memberIds.includes(e.userId));

        this.fetchChannelAsset();

      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async viewMember(member) {
      let memberIds = member.userId;

      //get member data, if empty
      let data = this.channelAssets[memberIds];
      if (data) {
        this.selectedMemberId = memberIds;
        return;
      }

      try {
        this.$store.commit('setLoading', true);

        let memberAsset = await GetChannelMemberAssets([memberIds]);
        Object.assign(this.channelAssets, memberAsset);
        this.selectedMemberId = memberIds;

        this.$store.commit('setLoading', false);

      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    memberInviteForm() {
      this.dialog = true;
      this.inviteNewMember = true;
    },

    async sendInvitation() {
      if (!this.selectedChannel) return;

      let channel = this.selectedChannel;

      try {
        if (this.$refs.inviteForm.validate()) {
          this.inviteLoading = true;

          //get the members id
          let memberIds = this.newMembers.map(e => e.userId);

          await SendChannelInvitation({
            'channelId': channel.channelId,
            'newMemberIds': memberIds,
            'remarks': this.inviteMessage
          });

          this.inviteLoaidng = false;
          this.dialog = false;

          this.$store.commit('showSuccess', 'Invitation sent');
        }
      }
      catch(error) {
        this.$store.commit('showError', error);
        this.inviteLoading = false;
      }
    },

    exitChannelDialog(channel) {
      this.dialog = true;
      this.isExitChannel = true;
      this.selectedChannel = channel;
    },

    cancelExit() {
      this.dialog = false;
      this.isExitChannel = false;
    },

    async exitChannel() {
      if (!this.selectedChannel) return;

      try {
        this.exitLoading = true;
        await ExitChannel(this.selectedChannel.channelId);
        this.exitLoading = false;

        this.cancelExit();

        this.$store.commit('showSuccess', 'Channel Exit Success!');
        this.fetchChannel();

      }
      catch (error) {
        this.$store.commit('showError', error);
        this.exitLoading = false;
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

    async fetchChannelAsset() {
      try {
        if (this.selectedChannel) {
          this.channelTableLoading = true;
          
          const {channelId} = this.selectedChannel;
          this.channelData = await GetChannelAssets(channelId).then(result => {
            let assetMap = new Map();

            assetMap.set('Record', {
              'headers': this.headersMap.get('Record'),
              'items': result
            });

            return assetMap;
          });

          this.channelTableLoading = false;

        }
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.channelTableLoading = false;
      }
    },

    addChannelAssetDialog() {
      this.dialog = true;
      this.isChannelAsset = true;
    },

    channelAssetDialogCancel() {
      this.dialog = false;
      this.isChannelAsset = false;
    },

    async addChannelAsset() {
      try {
      if (this.$refs.file.validate()) {
        const files = this.$refs.file.files();
        if (files) {
          this.channelLoading = true;
          const {channelId} = this.selectedChannel;

          await UploadChannelAsset({
            channelId: channelId,
            files: files
          });

          this.channelAssetDialogCancel();
          this.$store.commit('showSuccess', 'Channel record uploaded');
          this.fetchChannelAsset();

        }
      }
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.channelLoading = false;
      }
    }
  }

}
</script>

<style scoped>

.channel-card :hover {
  cursor: pointer;
}

</style>

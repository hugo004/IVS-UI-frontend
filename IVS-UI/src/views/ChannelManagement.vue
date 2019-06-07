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
      <v-flex xs12 class="pa-0">
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
            ></ivs-channel-card>
          </v-flex>
        </v-layout>
      </v-flex>
      
      <v-flex class="pa-0">
        <ivs-authorized-table
          v-if="selectedChannel"
          :tableData="authorizedData"
        >
          <template slot="header">
            <div class="mb-3 heading">
              Channel Name: {{ selectedChannel.name || ''}}
            </div>

            <v-select 
              :items="channelMembers"
              itemText="baseInfo.firstName"
              label="people"
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
      max-width="500"
    >
      <ivs-channel-create-form 
        ref="form"
        v-model="newChannelInfo"
      >
        <template slot="actions">
          <v-spacer></v-spacer>
          <v-btn 
            color="primary"
            :loading="createLoading"
            @click="onChannelCreate()"
          >
            create
          </v-btn>
          <v-btn
              outline
              @click="onCancel()"
            >
              cancel
          </v-btn>
        </template>
      </ivs-channel-create-form>
    </v-dialog>

  </v-container>
</template>

<script>

import {
  GetUserChannel,
  CreateChannel
} from '@/api/channel.js';


import { 
  GetAllRegistryAsset,
  GetSentRequestList,
  GetAsset,
  RequestAccessAsset,
  GetChannelMemberAssets
} from '@/api/asset.js'


export default {
  name: 'ChannelManagement',

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

    //channel members asset
    headersMap: new Map([
      ['Education', [
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
      ]],
      ['WorkExp', [
        {
          text: 'Company',
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
          text: 'Job Duty',
          value: 'jobduty',
          sortable: false
        }
      ]],
      ['VolunteerRecord', [
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
      ]]
    ]),

    channelAssets: [],
    selectedChannel: null,
    selectedMemberId: '',
    selectedMemberInfo: {}

  }),

  async mounted() {
    if (this.myChannels.length < 1) {
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

      this.$store.commit('setLoading', true);
    }

  },

  computed: {
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

    async onChannelCreate() {
      if (this.$refs.form.validate()) {

        // let name = this.newChannelInfo.name;
        // let members = this.newChannelInfo.members;
        const {name, members} = this.newChannelInfo;
        
        //call api and turn on loading effect
        this.createLoading = true;

        await CreateChannel({
          'name': name,
          'members': members
        });

        this.createLoading = false;
        this.dialog = false;

        //display message
        this.$store.commit('setMeesage', 'Channel created');
        this.$store.commit('showNotification', ['top', 'right']);
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

    async viewChannel(channel) {
      try {
        if (!channel) return;
        this.selectedChannel = channel;

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
        this.channelAssets = await GetChannelMemberAssets(memberIds);
        this.$store.commit('setLoading', false);

      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    viewMember(member) {
      this.selectedMemberId = member.userId;
    }
  }

}
</script>

<style scoped>

.channel-card :hover {
  cursor: pointer;
}

</style>

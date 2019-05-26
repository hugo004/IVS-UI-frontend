<template>
  <v-container 
  fluid 
  grid-list-xl 
  fill-height
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
          >
            <ivs-channel-card
              :channel="channel"
            ></ivs-channel-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <material-card 
          title="Channel Record"
          text="Channel Name: xx"
        >
          <v-data-table
            :headers="tableHeaders"
            :items="tableItems"
          >
          </v-data-table>
        </material-card>
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

export default {
  name: 'ChannelManagement',

  data()
  {
    return {
      dialog: false,
      createLoading: false,
      
      tableHeaders: [],
      tableItems: [],
      newChannelInfo: {
        'name': '',
        'members': []
      }
    }
  },

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
    }
  },

  methods: {
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

    onCancel() {
      this.dialog = false;
    }
  }

}
</script>

<style>

</style>

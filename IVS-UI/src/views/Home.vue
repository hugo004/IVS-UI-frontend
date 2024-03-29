<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex 
            v-for="(channel,index) in channels"
            :key="index"
            sm4
          >
            <ivs-channel-card
              :channel="channel"
            ></ivs-channel-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex  xs12>
        <material-card
          color="green"
          title="Transaction Stats"
          :text="`Latest transaction on, ${latestTranstionTime}`"
        >
          <template slot="header-actions">
            <!-- <v-text-field append-icon="search"></v-text-field> -->
            <v-btn  
              round 
              color="green"
              class="elevation-0"
              @click="upload=true"
            >add</v-btn>
          </template>

          <v-progress-linear :indeterminate="true"  v-if="tableLoading"/>

          <v-data-table
            :headers="headers"
            :items="items"
            :loading="tableLoading"
            class="red"
          >
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
              <span
                class="font-weight-light text-warning text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ index, item }"
            >
              <tr>
                <td>{{ item.transactionId }}</td>
                <td>{{ transationDate(item.transactionTimestamp) }}</td>
                <td>{{ transactionType(item.transactionType) }}</td>
              </tr>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>

    <v-dialog 
      v-model="upload"
      persistent
      scrollable
      max-width="800"
    >
      <v-card>
        <v-card-text>
          <ivs-file-upload-form 
            ref="file"
            :recordType.sync="recordType"
            :verifier.sync="verifier"
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            outline 
            @click="upload=false"
          >
            close
          </v-btn>

          <v-btn color="primary" 
          @click="saveRecord()" 
          :loading="loading"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { 
  UploadRecord
} from "@/api/record.js";

import {
  GetUserChannel
} from '@/api/channel.js'

import {
  UploadAsset,
  GetHistoryData
} from '@/api/asset.js'

export default {
  name: 'HomePage',

  data () {
    return {
      upload: false,
      loading: false,
      tableLoading: false,
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Timestamp',
          value: 'time'
        },
        {
          sortable: false,
          text: 'Action',
          value: 'total_transaction',
        }
      ],
      items: [],
      channels: [],
      recordType: 'Other',
      verifier: ''


    }
  },
  
  async mounted()
  {
    await this.fetchChannel();

    await this.fetchHistoryTransaction();

  },

  computed: {
    latestTranstionTime() {
      if (this.items.length > 0) {
        let last = this.items[0];
        return this.transationDate(last.transactionTimestamp);
      }
    }
  },

  methods: {
    async saveRecord(){
      try {

          if (this.$refs.file.validate()) {
            this.loading = true;
            let files = this.$refs.file.files();
            await UploadRecord(files, this.recordType, this.verifier);

            this.loading = false;
            this.upload = false;

            this.$store.commit('showSuccess', 'Record Uploaded');
          }
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.loading = false;
      }
    },

    async fetchChannel() {
      try {
        this.$store.commit('setLoading', true);
        
        this.channels = await GetUserChannel().then((result) => {
          let integrated = [];
          //repalce the channel's member property from string id to member info (string[] with object[])
          result.forEach(e => {
            let {channel, membersInfo} = e;
            channel.members = membersInfo;
            integrated.push(channel);
          });
          
          this.$store.commit('setChannels', integrated);
          return integrated;
        });

        this.$store.commit('setLoading', false);
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async fetchHistoryTransaction() {
      try {
        this.tableLoading = true;

        let userInfoStr = localStorage.getItem('userInfo');
        let userInfo = JSON.parse(userInfoStr);
        const {userId} = userInfo;

        let _this = this;
        this.items = await GetHistoryData().then(result => {
          //filter out the transation is belong me
          let myHistory = result.filter(e => _this.invokedUser(e.participantInvoking) == userId);
          return myHistory;
        });
        this.tableLoading = false;
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    transactionType(type) {
      let assetType = type.split('.');
      assetType = assetType[assetType.length - 1];

      return assetType;
    },

    invokedUser(invoked) {
      if (!invoked) return '';

      let user = invoked.split('#');
      user = user[user.length - 1];

      return user;
    },

    transationDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    }
  }
}
</script>

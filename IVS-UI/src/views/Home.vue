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
          text="Latest transaction on, Sep 20"
        >
          <template slot="header-actions">
            <v-text-field append-icon="search"></v-text-field>
            <v-btn  
              round 
              color="green"
              class="elevation-0"
              @click="upload=true"
            >add</v-btn>
          </template>

          <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
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
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td class="text-xs-right">{{ item.salary }}</td>
              <td class="text-xs-right">{{ item.country }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>

    <v-dialog 
      v-model="upload"
      persistent
      scrollable
    >
      <v-card>
        <v-card-text>
          <ivs-upload-record 
            @save="saveRecord" 
            class="text-xs-left"
            :loading="loading"
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            flat 
            color="secondary"
            @click="upload=false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { 
  CreateRecord,
  GetRecords
} from "@/api/record.js";

import {
  GetUserChannel
} from '@/api/channel.js'

import {
  UploadAsset
} from '@/api/asset.js'

export default {
  data () {
    return {
      upload: false,
      loading: false,
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Time',
          value: 'time'
        },
        {
          sortable: false,
          text: 'Block Number',
          value: 'block_number',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Total Transaction',
          value: 'total_transaction',
          align: 'right'
        }
      ],
      items: [

      ],

      channels: []

    }
  },
  
  async mounted()
  {

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

  },

  methods: {
    async saveRecord(record)
    {
      try {
        console.log(record);
        if (record) {
          this.loading = true;

          const {educations, workExps, volunteer} = record;
          await UploadAsset({
            'educations': educations,
            'workExps': workExps,
            'volunteerRecords':volunteer
          });

          this.loading = false;
          this.upload = false;
        }
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.loading = false;
      }
    }
  }
}
</script>

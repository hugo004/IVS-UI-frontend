<template>
<v-container 
  fluid 
  grid-list-xl 
  fill-height
>
  <v-layout 
    justify-center 
    fill-height
    row
    wrap
  >
    <v-flex xs12>
      <material-card 
        title="Notifications"
        :text="`Last updated at ${lastUpdated}`"
      >        
        <v-btn
          slot="header-actions" 
          dark
          flat
          @click="fetchRequestList()"
        >
          <v-icon>refresh</v-icon>
          <span class="heading px-1">Refresh</span>
        </v-btn>

        <v-data-table 
          :headers="tableHeaders" 
          :items="tableItems"
        >
          <template v-slot:headerCell="{ header }" >
            <span
              class="subheading font-weight-light text-success"
              v-text="header.text"
            />
          </template>
          <template v-slot:items="props">
            <tr @click="viewRequestDetail(props.item)">
              <td class="text-xs-left">{{ props.item.requestName }}</td>
              <td class="text-xs-left">{{ props.item.senderName }}</td>
              <td class="text-xs-left">{{ new Date(props.item.createTime).toLocaleString() }}</td>
              <td class="text-xs-left">{{ props.item.status }}</td>
              <td class="text-xs-left">{{ props.item.remarks }}</td>
              <td 
                v-if="isUndetermined(props.item.status)"
                class="text-xs-right"
              >
                <v-btn
                  round
                  color="green"
                  dark
                  @click.stop="acceptOrDeny(props.item, 'ACCEPT')"
                >
                  Accept
                </v-btn>
                <v-btn
                  round
                  dark
                  color="grey"
                  @click.stop="acceptOrDeny(props.item, 'DENY')"
                >
                  Deny
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </material-card>
    </v-flex>
  </v-layout>

  <v-dialog
    v-model="dialog"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-layout fill-height column>
      <v-card
        height="50px"
        color="dark-grey"
        class="elevation-5 text-xs-center"
        dark
      >
        <span class="title dark-grey">{{ fileName }}</span>
        <v-btn 
          @click="dialog=false" 
          fab
          top
          right
          absolute
          class="mt-5"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card>

      <iframe class="black" 
        :src="fileUrl" 
        frameborder="0" 
        height="100%" 
        align="middle"
        />
    </v-layout>
  </v-dialog>
</v-container>
</template>

<script>
import {
  GetAccessRequestList,
  UpdateRequestStatus,
  UpdateChannelInvitationStatus,
  GetAsset
} from '@/api/asset.js';

export default {
  name: 'Notifications',
  data() 
  {
    return {
      tableHeaders: [{
          text: 'Event',
          align: 'left',
          sortable: false,
          value: 'new_event_icon'
        },
        {
          text: 'From',
          align: 'left',
          sortable: false,
          value: 'from'
        },
        {
          text: 'Date',
          align: 'left',
          sortable: false,
          value: 'date'
        },
        {
          text: 'Status',
          align: 'left',
          sortable: false,
          value: 'status'
        },
        {
          text: 'Remarks',
          align: 'left',
          sortable: false,
          value: 'remarks'
        },
        {
          text: '',
          align: 'left',
          sortable: false,
          value: 'actions'
        },
      ],
      tableItems: [],

      dialog: false,
      fileUrl: '',
      fileName: '',
    }
  },

  mounted() {
    this.fetchRequestList();
  },

  computed: {
    lastUpdated() {
      if (this.tableItems.length > 0) {
        let last = this.tableItems[this.tableItems.length - 1];
        return this.transationDate(last.createTime);
      }
    }
  },

  methods: {
    transationDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    },

    isUndetermined(status) {
      if (status.toLowerCase() == "undetermined")
      {
        return true;
      }

      return false;
    },

    async fetchRequestList() {
      try {
        this.$store.commit('setLoading', true);
        this.tableItems = await GetAccessRequestList();
        this.$store.commit('setLoading', false);
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async acceptOrDeny(request, status) {
      const {
        requestId, 
        senderId, 
        assetName,
        requested,
        requestType
      } = request;

      this.$store.commit('setLoading', true);
      if (requestType == 'CHANNEL') {
        await UpdateChannelInvitationStatus({
          'channelId': senderId,
          'requestId': requestId,
          'status': status
        });
      }
      else {
        await UpdateRequestStatus({
          'senderId': senderId,
          'requestId': requestId,
          'assetName': assetName,
          'authorizeList': requested,
          'newStatus': status
        });
      }
      this.$store.commit('setLoading', false);
      this.$store.commit('setMessage', 'Request status updated')
      this.$store.commit('showNotification');

      //refresh the list
      this.fetchRequestList();
    },

    async viewRequestDetail(info) {
      try {
        const {requestType} = info;
        if (requestType == 'ASSET') {
          console.log('getAsset');

          this.$store.commit('setLoading', true);
          let asset = await GetAsset({
            'assetName': info.assetName,
            'assetIds': info.requested
          });
          this.$store.commit('setLoading', false);

          this.viewRecord(asset[0]);
        }
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    viewRecord(data) {
      const {fileType, encrypted, name} = data;
      let fileUrl = `data:${fileType};base64,${encrypted}#toolbar=0&navpanes=0&scrollbar=0`;
      
      this.fileName = name;
      this.fileUrl = fileUrl;
      this.dialog = true;
    }
  }
}
</script>

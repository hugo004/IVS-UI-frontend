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
        text="Last updated at xxx"
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
            <tr>
              <td class="text-xs-left">{{ props.item.requestName }}</td>
              <td class="text-xs-left">{{ props.item.receiverName }}</td>
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
                  @click="acceptOrDeny(props.item, 'ACCEPT')"
                >
                  Accept
                </v-btn>
                <v-btn
                  round
                  dark
                  color="grey"
                  @click="acceptOrDeny(props.item, 'DENY')"
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
</v-container>
</template>

<script>
import {
  GetAccessRequestList,
  UpdateRequestStatus
} from '@/api/notification.js';

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

    }
  },

  mounted() {
    this.fetchRequestList();
  },

  methods: {
    isUndetermined(status) {
      if (status.toLowerCase() == "undetermined")
      {
        return true;
      }

      return false;
    },

    async fetchRequestList() {
      this.$store.commit('setLoading', true);
      this.tableItems = await GetAccessRequestList();
      this.$store.commit('setLoading', false);
    },

    async acceptOrDeny(request, status) {
      const {
        requestId, 
        senderId, 
        assetName,
        requested
      } = request;

      this.$store.commit('setLoading', true);
      await UpdateRequestStatus({
        'senderId': senderId,
        'requestId': requestId,
        'assetName': assetName,
        'authorizeList': requested,
        'newStatus': status
      });
      this.$store.commit('setLoading', false);
      this.$store.commit('setMessage', 'Request status updated')
      this.$store.commit('showNotification');

      //refresh the list
      this.fetchRequestList();
    }
  }
}
</script>

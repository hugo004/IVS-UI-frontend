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
        title="Verification"
        :text="`Last updated at ${lastUpdated}`"
      >        
        <v-btn
          slot="header-actions" 
          dark
          flat
          @click="fetchVerifyRecordList()"
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
            <tr @click="viewRecord(props.item)" class="record-detail">
              <td class="text-xs-left">{{ dataTimeString(props.item.creatTime) }}</td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.owner.baseInfo.userName }}</td>
              <td class="text-xs-left">{{ props.item.isVerify ? 'Verified' : 'Not Verify' }}</td>

              <td 
                v-if="!props.item.isVerify"
                class="text-xs-right"
              >
                <v-btn
                  round
                  color="green"
                  dark
                  @click.stop="verify(props.item, true)"
                >
                  Verify
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
  GetRecords,
  VerifyRecord
} from '@/api/record.js'

export default {
  name: 'Verify',
  data() 
  {
    return {
      tableHeaders: [
        {
          text: 'Date',
          align: 'left',
          sortable: false,
          value: 'date'
        },
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'From',
          align: 'left',
          sortable: false,
          value: 'from'
        },
        {
          text: 'Status',
          align: 'left',
          sortable: false,
          value: 'status'
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
      fileName: ''
      

    }
  },

  mounted() {
    this.fetchVerifyRecordList();
  },

  computed: {
    lastUpdated() {
      if (this.tableItems.length > 0) {
        let last = this.tableItems[0];
        return this.transationDate(last.creatTime);
      }
    }
  },

  methods: {
    transationDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    },

    dataTimeString(dateString) {
      return new Date(dateString).toLocaleDateString();
    },

    async fetchVerifyRecordList() {
      try {
        this.$store.commit('setLoading', true);
        this.tableItems = await GetRecords();
        this.$store.commit('setLoading', false);
      }
      catch (error) {
        this.$store.commit('showError', error);
      }
    },

    async verify(record, status) {
      try {
        this.$store.commit('setLoading', true);
    
        await VerifyRecord({
          recordId: record.assetId,
          recordName: record.name,
          ownerId: record.owner.userId,
          ownerName: record.owner.baseInfo.userName,
          isVerify: status
        });
        
        this.$store.commit('setLoading', false);
        this.fetchVerifyRecordList();
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



<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex
        md12
        sm12
        lg4
      >
        <material-card
          color="green"
          title="Channal Group 1"
          text = "Hugo, Lock"
        >
          <h3 class="title font-weight-light">Completed Tasks</h3>
          <p class="category d-inline-flex font-weight-light">Last Last Campaign Performance</p>

          <template slot="actions">
            <v-icon
              class="mr-2"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">Join channel time</span>
          </template>
        </material-card>
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="green"
          icon="mdi-store"
          title="Revenue"
          value="$34,245"
          sub-icon="mdi-calendar"
          sub-text="Last 24 Hours"
        />
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
    >
      <v-card>
        <ivs-upload-record @save="saveRecord"/>
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
import { CreateRecord } from "@/api/record.js";
export default {
  data () {
    return {
      upload: false,
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
        {
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738'
        },
        {
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        }, {
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        }, {
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        }, {
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542'
        }
      ]

    }
  },

  methods: {
    saveRecord(record)
    {
      console.log(record);
    }
  }
}
</script>

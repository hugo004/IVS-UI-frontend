<template>
  <material-card>

    <!-- pass all slot -->
      <slot 
        v-for="slot in Object.keys($slots)"
        :name="slot"
        :slot="slot"
      ></slot>
      
      <v-tabs
        dark
        icons-and-text
        show-arrows
        color="primary"
      >
        <v-tabs-slider color="white"></v-tabs-slider>
        <!-- the category display authorize item only -->
        <v-tab 
          v-for="(tab, index) in tableData.keys()" 
          :key="index"
          :href="`#tab-${index}`"
        >
          {{ tab }}
        </v-tab>

        <v-tab-item
          v-for="(key, i) in tableData.keys()" 
          :key="i"
          :value="`tab-${i}`"
        >
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="tableHeader(key)"
                :items="tableItems(key)"
              >
                <template v-slot:items="props">
                  <tr>
                    <td 
                      v-for="(data,index) in content(key, props.item)"
                      :key="index"
                      >
                        {{ data }}
                      </td>

                      <td v-if="showAction" class="text-xs-right">
                        <v-btn
                          small
                          color="primary"
                          @click="$emit('click', props.item)"
                        >
                          revoke
                        </v-btn>
                      </td>
                  </tr>
                  
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
  </material-card>
</template>

<script>
export default {
  inheritAttrs: false,
  
  props: {
    showAction: Boolean,
    loading: Boolean,
    tableData: Map,
    

  },

  data: () => ({

    //education
    educationHeaders: [
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
    ],

    //work exp
    workExpHeaders: [
      {
        text: 'Name',
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
      },
    ],

    //vomlunteer record
    volunteerHeaders: [
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
    ],
  }),

  methods: {
    tableHeader(key) {
      return this.tableData.get(key).headers || [];
    },

    tableItems(key) {
      return this.tableData.get(key).items || [];
    },

    dataTimeString(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    test() {
      console.log('s')
    },
    action(item) {
      if (this.showAction) {
        return `
          <td class="text-xs-right">
              <a
                class="v-btn v-btn--small theme--light primary"
                @click.prevent="test()"
              >revoke</a>
            </td>
        `;
      }

      return '';
    },

    content(name, item) {
      let dataList = [];
      if (name == 'Education') {
        dataList.push(item.info.school);
        dataList.push(item.info.major);
        dataList.push(this.dataTimeString(item.info.to));
        dataList.push(this.dataTimeString(item.info.from));
      }
      else if (name == 'WorkExp') {
        dataList.push(item.info.company);
        dataList.push(this.dataTimeString(item.info.to));
        dataList.push(this.dataTimeString(item.info.from));
        dataList.push(item.info.jobTitle);
        dataList.push(item.info.jobDuty);
      }
      else if (name == 'VolunteerRecord') {
      }

      return dataList;
    },
  }
}
</script>

<style>

</style>

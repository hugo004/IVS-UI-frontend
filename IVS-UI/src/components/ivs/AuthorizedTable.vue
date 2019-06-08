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
                  <tr v-html="content(key, props.item)"></tr>
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

    content(name, item) {
      if (name == 'Education') {
        return `
          <td>${item.info.school}</td>
          <td>${item.info.major}</td>
          <td>${this.dataTimeString(item.info.to)}</td>
          <td>${this.dataTimeString(item.info.from)}</td>
        `;
      }
      else if (name == 'WorkExp') {
        return `
          <td>${item.info.company}</td>
          <td>${this.dataTimeString(item.info.to)}</td>
          <td>${this.dataTimeString(item.info.from)}</td>
          <td>${item.info.jobTitle}</td>
          <td>${item.info.jobDuty}</td>
        `;
      }
      else if (name == 'VolunteerRecord') {
        return ``;
      }

      return '';
    },
  }
}
</script>

<style>

</style>

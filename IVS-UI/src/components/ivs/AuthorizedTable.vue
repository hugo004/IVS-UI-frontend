<template>
  <material-card v-bind="$attrs">

    <!-- pass all slot -->
      <slot 
        v-for="slot in Object.keys($slots)"
        :name="slot"
        :slot="slot"
      ></slot>

      <div class="block text-xs-center">
        <slot name="no-data">
          <span v-if="fields.length == 0">No data available</span>
        </slot>
      </div>

      <v-tabs
        v-if="fields.length > 0"
        dark
        icons-and-text
        show-arrows
        :color="tabColor"
        :slot="offset"
      >
        <v-tabs-slider color="white"></v-tabs-slider>
        <!-- the category display authorize item only -->
        <v-tab 
          v-for="(tab, index) in fields" 
          :key="index"
          :href="`#tab-${index}`"
        >
          {{ tab }}
        </v-tab>

        <v-tab-item
          v-for="(key, i) in fields" 
          :key="i"
          :value="`tab-${i}`"
        >
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="tableHeader(key)"
                :items="tableItems(key)"
                v-bind="$attrs"
                :style="tableStyle"
              >
                <template v-slot:items="props">
                  <tr @click="onItemClick(props.item)" class="record-detail">
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
                          @click.stop="$emit('click', props.item)"
                        >
                          <v-icon small>fas fa-lock</v-icon>
                          <span class="heading px-2">revoke</span>
                        </v-btn>
                      </td>
                  </tr>
                  
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>


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
  </material-card>
</template>

<script>
export default {
  inheritAttrs: false,
  
  props: {
    showAction: Boolean,
    loading: Boolean,
    tableData: Map,
    offset: String,
    tabColor: {
      type: String,
      default: 'primary'
    },

    tableStyle: String

  },

  data: () => ({
    dialog: false,
    fileUrl: '',
    fileName: ''
  }),

  computed: {
    fields() {
      if (this.tableData) {
        return [...this.tableData.keys()];
      }

      return [];
    },
  },

  methods: {
    tableHeader(key) {
      if (this.tableData.get(key)) {
        return this.tableData.get(key).headers || [];
      }

      return [];
    },

    tableItems(key) {
      if (this.tableData.get(key)) {
        return this.tableData.get(key).items || [];
      }
      
      return [];
    },

    dataTimeString(dateString) {
      return new Date(dateString).toLocaleDateString();
    },

    content(name, item) {
      let dataList = [];

      dataList.push(this.dataTimeString(item.createTime));
      dataList.push(item.name);
      dataList.push(item.fileType);

      return dataList;
    },

    onItemClick(item) {
      const {$class} = item;
      if ($class == 'org.example.ivsnetwork.Record') {
        this.viewRecord(item);
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

<style>

</style>

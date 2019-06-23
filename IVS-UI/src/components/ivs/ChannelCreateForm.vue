<template>
  <v-form
    ref="channelForm"
    v-model="isValidForm"
    lazy-validation
  >
    <v-card>
      <v-card-title class="title">Channel Creation</v-card-title>
      <v-card-text>
        <v-layout
          justify-center
          align-center
          wrap
        >
          <v-flex xs12>
            <v-text-field 
              label="*Channel name"
              v-model="channelInfo.name"
              required
              :rules="nameRules"
              autofocus
            />
          </v-flex>

          <v-flex xs12>
            <v-combobox 
              v-model="channelInfo.members"
              :items="itemList"
              itemText="baseInfo.userName"
              :loading="userLoading"
              label="Invite channel member"
              placeholder="enter member id/name e.g. u-001/user001"
              multiple
              chips
              return-object
            >
              <span slot="no-data" class="ma-4">no avaiable member</span>
            </v-combobox>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>

export default {
  props: {
    channelInfo: {
      type: Object,
      default: () => ({
        'name': '',
        'members': []
      })
    },
    
    loading: Boolean,
    itemList: Array
  },

  model: {
    prop: 'channelInfo',
    event: 'update'
  },



  computed: {
    nameRules() {
      return [ v => !!v || 'required'];
    }
  },

  data: () => ({
    isValidForm: true,
    userLoading: false
  }),

  watch: {
    loading(val) {
      this.userLoading = val;
    }

  },

  methods: {
    validate() {
      return this.$refs.channelForm.validate();
    },


  }
}
</script>

<style>

</style>

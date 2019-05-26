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
              label="Invite channel member"
              placeholder="enter member id e.g. u-001"
              multiple
              chips
            />
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
    }
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
    isValidForm: true
  }),

  methods: {
    validate() {
      return this.$refs.channelForm.validate();
    }
  }
}
</script>

<style>

</style>

<template>
  <v-form 
    ref="form"
    v-bind="$attrs"
  >
    <v-card>
      <v-card-title class="title">
        Registration
        <v-spacer></v-spacer>
        <slot name="header-actions"></slot>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
          <v-text-field 
            prepend-icon="person"
            v-model="registInfo.userName"
            :rules="requiredRule"
            label="*Username" 
            type="text"
            ></v-text-field>

          <v-text-field
            v-model="registInfo.password"
            :rules="requiredRule"
            prepend-icon="lock"
            label="*Password"
            type="password"
          ></v-text-field>

          <v-text-field
            v-model="confirmPswd"
            :rules="passwordRules"
            prepend-icon="lock"
            label="*Confirm Password"
            type="password"
          ></v-text-field>

          <v-layout>
            <v-text-field 
              prepend-icon="person"
              v-model="registInfo.firstName"
              :rules="requiredRule"
              label="*First Name" 
              type="text"
              ></v-text-field>
              <span class="mx-2"></span>
            <v-text-field 
              v-model="registInfo.lastName"
              :rules="requiredRule"
              label="*Last Name" 
              type="text"
              ></v-text-field>
          </v-layout>

          <v-text-field 
            prepend-icon="email"
            v-model="registInfo.email"
            label="Email" 
            type="email"
            ></v-text-field>

          <v-text-field 
            prepend-icon="phone"
            v-model="registInfo.phone"
            label="Phone" 
            type="text"
            mask="#### ####"
            ></v-text-field>
      </v-card-text>

      <v-card-actions class="py-2">
        <slot name="footer-actions" />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>

import mixin from '../mixin.js';

export default {
  inheritAttrs: false,
  
  name: 'RegistrationForm',

  mixins: [mixin],

  model: {
    prop: 'registInfo',
    event: 'update'
  },

  props: {
    registInfo: {
      type: Object,
      default: () => ({
        'userName': '',
        'password': '',
        'firstName': '',
        'lastName': '',
        'email': '',
        'phone': ''
      })
    }
  },

  data: () => ({
    'confirmPswd': ''
  }),

  computed: {
    passwordRules() {
      return [
        v => this.checkPasswordMath() || 'password not match'
      ];
    }
  },

  methods: {
    validate() {
      return this.$refs.form.validate();
    },

    checkPasswordMath() {
      return (this.confirmPswd == this.registInfo.password);
    },

  }
}
</script>

<style>

</style>

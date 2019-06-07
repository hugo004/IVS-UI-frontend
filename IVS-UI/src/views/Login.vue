<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 class="text-xs-left">
            <v-card class="elevation-12">
              <v-card-title class="primary white--text title">Login Form</v-card-title>
              <v-card-text>
                <v-form
                  v-model="isValid"
                  lazy-validation
                  ref="form"
                >
                  <v-text-field 
                    prepend-icon="person"
                    required
                    v-model="userName"
                    :rules="requriedRule"
                    label="Login" 
                    type="text"
                    ></v-text-field>
                  <v-text-field
                    required
                    v-model="password"
                    :rules="requriedRule"
                    prepend-icon="lock"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  color="primary" 
                  @click="login()"
                  :loading="loading"
                >Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { LoginIVS } from "@/api/auth.js";

export default {
  data: () => ({
    userName: "",
    password: "",
    isValid: true,
    loading: false,
    requriedRule: [
      v => !!v || 'required'
    ],
  }),

  methods: {
    async login() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          let resposne = await LoginIVS({
            userName: this.userName,
            password: this.password
          });
          this.loading = false;
          localStorage.setItem('token', resposne.accessToken);
          localStorage.setItem('userInfo', resposne.userInfo);
          location.href = '/';
        }
      }
      catch (error) {
        this.$store.commit('setNotifyType', 'error');
        this.$store.commit('setMessage', error);
        this.$store.commit('showNotification');
        this.loading = false;
      }
    }
  }
};
</script>

<style>
</style>

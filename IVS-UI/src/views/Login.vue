<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 class="text-xs-left">
            <v-card class="elevation-12">
              <v-card-title class="primary white--text title">
                Login Form
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  dark
                  small
                  @click="showRegistrationForm()"
                >
                  <v-icon>fas fa-user-plus</v-icon>
                </v-btn>
              </v-card-title>
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

                  <v-radio-group v-model="isVerifier" row>
                    <v-radio color="primary" label="Normal User" :value="false"></v-radio>
                    <v-radio color="primary" label="Verifier" :value="true"></v-radio>
                  </v-radio-group>
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

    <v-dialog
      persistent
      v-model="dialog"
      max-width="800"
    >
      <ivs-registration-form 
        ref="registForm"
        lazy-validation
        v-model="registInfo"
      >
      <template slot="header-actions">
        <v-btn
          icon
          @click="dialog=false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>

        <template slot="footer-actions">
          <v-btn
            block
            color="primary"
            :loading="createLoading"
            @click="registration()"
          >
            register
          </v-btn>
        </template>
      </ivs-registration-form>
    </v-dialog>
  </v-app>
</template>

<script>
import { 
  LoginIVS,
  VerifierLoginIVS,
  Registration
} from "@/api/auth.js";

export default {
  name: 'Login',

  data: () => ({
    userName: "",
    password: "",
    isValid: true,
    loading: false,
    dialog: false,
    requriedRule: [
      v => !!v || 'required'
    ],

    //registration
    createLoading: false,
    registInfo: {
      'userName': '',
      'password': '',
      'firstName': '',
      'lastName': '',
      'email': '',
      'phone': ''
    },

    isVerifier: false
  }),

  methods: {
    async login() {

      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          let response;
          
          if (this.isVerifier) {
            response = await VerifierLoginIVS({
              userName: this.userName,
              password: this.password
            });
          }
          else {
            response = await LoginIVS({
              userName: this.userName,
              password: this.password
            });
          }
          this.loading = false;
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('userInfo', response.userInfo);
          location.href = '/';
        }
      }
      catch (error) {
        this.$store.commit('setNotifyType', 'error');
        this.$store.commit('setMessage', error);
        this.$store.commit('showNotification');
        this.loading = false;
      }
    },

    showRegistrationForm() {
      this.dialog = true;
    },

    async registration() {
      try {
        if (this.$refs.registForm.validate()) {
          this.createLoading = true;
          console.log(this.registInfo);
          await Registration(this.registInfo);

          this.createLoading = false;
          this.dialog = false;

          //auto fill after register success
          this.userName = this.registInfo.userName;
          this.password = this.registInfo.password;
        }
      }
      catch (error) {
        this.$store.commit('showError',error);
        this.createLoading = false;
      }
    }
  }
};
</script>

<style>
</style>

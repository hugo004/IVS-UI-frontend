<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        xs12
        md10
      >

        <ivs-authorized-table 
          :tableData="myProfile" 
          offset="offset"
          tabColor="dark-grey"
          color="dark-grey"
        >
          <template slot="header">
            <span class="title text-capitalize">User Records</span>
          </template>
        </ivs-authorized-table>
      </v-flex>
      <v-flex
        xs12
        md2
      >
        <material-card class="v-card-profile">
          <v-avatar
            slot="offset"
            class="mx-auto d-block"
            size="130"
          >
            <img
              src="../assets/user_icon.png"
            >
          </v-avatar>
          <v-card-text class="text-xs-center">
            <h4 class="card-title font-weight-light">{{ userInfo.userName }}</h4>
            <v-text-field 
              label="First name"
              :value="userInfo.firstName"
            />
            <v-text-field 
              label="Last name"
              :value="userInfo.lastName"
            />
            <v-text-field 
              label="Email"
              :value="userInfo.email"
            />
            <v-text-field 
              label="Phone"
              :value="userInfo.phone"
            />
          </v-card-text>
        </material-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import {
  GetMyProfile
} from '@/api/asset.js'
import { mapState } from 'vuex';

export default {
  name: 'Profile',

  data: () => ({
    dialog: false,
    fileUrl: '',
    fileName: ''
  }),

  async created() {
    try {
      if (!this.myProfile) {
        this.$store.commit('setLoading', true);

        let _this = this;
        await GetMyProfile().then(result => {
          let map = new Map();
          for (let field in result) {
            map.set(field, {
              headers: _this.headersMap.get(field),
              items: result[field]
            })
          }
          this.$store.commit('setProfile', map);
          return map;
        });
        this.$store.commit('setLoading', false);
      }
    }
    catch (error) {
      this.$store.commit('showError', error);
    }
  },

  computed: {
    ...mapState({
      headersMap: state => state.assetHeadersMap,
      myProfile: state => state.myProfile
    }),

    userInfo() {
      if (localStorage.getItem('userInfo')) {
        let userInfoStr = localStorage.getItem('userInfo');
        let userInfo = JSON.parse(userInfoStr).baseInfo;
        return userInfo;
      }

      return {};
    }
  }
}
</script>

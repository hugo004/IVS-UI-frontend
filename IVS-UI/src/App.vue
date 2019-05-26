<template>
  <v-app>
    <template v-if="isLogin">
      <!-- <core-filter /> -->

      <core-toolbar />

      <core-drawer />

      <core-view />
    </template>

    <template v-else>
      <router-view></router-view>
    </template>

    <v-dialog :value="loading">
      <v-progress-circular 
        :indeterminate="true" 
        color="primary"
        :size="100"
        :width="10"
      />
    </v-dialog>

    <!-- notifcation popup -->
    <v-snackbar
      :color="color"
      :bottom="bottom"
      :top="top"
      :left="left"
      :right="right"
      v-model="snackbar"
      dark
    >
      <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      <div>{{ message }}</div>
      <v-icon
        size="16"
        @click="snackbar = false"
      >
        mdi-close-circle
      </v-icon>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    isLogin: localStorage.getItem('token') ? true : false
  }),


  computed: {
    message() {
      return this.$store.state.message;
    },

    color() {
      return this.$store.state.notifyType;
    },

    top() {
      return this.$store.state.top;
    },

    bottom() {
      return this.$store.state.bottom;
    },

    left() {
      return this.$store.state.left;
    },

    right() {
      return this.$store.state.right;
    },

    snackbar: {
      get(){
        return this.$store.state.snackbar;
      },

      set(val){
        this.$store.commit('setSnack', val);
      }
    },

    loading() {
      return this.$store.state.loading;
    }
  },

  created() {
    if (this.isLogin) {
      this.$router.push('/dashboard');
    }
  }
}
</script>


<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}

.v-dialog {
  box-shadow: none; 
  text-align: center
}

</style>

// https://vuex.vuejs.org/en/mutations.html

export default {
  setChannels(state, myChannel) {
    state.myChannels = myChannel;
  },

  //profile
  setProfile(state, myProfile) {
    state.myProfile = myProfile;
  },

  //notification control
  showNotification(state, args=['top', 'right']) {
    state.top = false
    state.bottom = false
    state.left = false
    state.right = false

    for (const loc of args) {
      state[loc] = true
    }

    // state.color = state.colors[Math.floor(Math.random() * state.colors.length)]

    state.snackbar = true
  },

  setNotifyType(state, type) {
    state.notifyType = type;
  },

  setMessage(state, msg) {
    state.message = msg;
  },

  setSnack(state, val) {
    state.snackbar = val;
  },

  setLoading(state, val) {
    state.loading = val;
  },

  showError(state, msg) {
    state.message = msg;
    state.notifyType = 'error';

    state.top = true;
    state.right = true;
    state.snackbar = true;
    state.loading = false;
  },

  showSuccess(state, msg) {
    state.message = msg;
    state.notifyType = 'success';

    state.top = true;
    state.right = true;
    state.snackbar = true  
  },

  showWarning(state, msg) {
    state.message = msg;
    state.notifyType = 'warning';
    
    state.top = true;
    state.right = true;
    state.snackbar = true  
  },
}

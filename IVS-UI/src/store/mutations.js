// https://vuex.vuejs.org/en/mutations.html

export default {
  setChannels(state, myChannel) {
    state.myChannels = myChannel;
  },

  //notification control
  showNotification(state, args=[]) {
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
  }
}

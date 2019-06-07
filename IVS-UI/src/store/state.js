// https://vuex.vuejs.org/en/state.html

export default {
  //user info
  userInfo: null,
  myChannels: [],

  //progress loading
  loading: false,

  //notification bar control
  message: '',
  notifyType: 'success',
  colors: [
    'purple',
    'info',
    'success',
    'warning',
    'error'
  ],
  top: true,
  bottom: false,
  left: false,
  right: false,
  snackbar: false,
}

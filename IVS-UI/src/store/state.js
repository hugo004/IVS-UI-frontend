// https://vuex.vuejs.org/en/state.html

export default {
  //verifier
  isVerifier: false,
  //user info
  myChannels: [],
  
  //my profile
  myProfile: null,

  //asset header map
  assetHeadersMap: new Map([
    ['Education',[
      {
        text: 'Date',
        value: 'date',
        sortable: true
      },
      {
        text: 'File Name',
        value: 'fn',
        sortable: false
      },

      {
        text: 'File Type',
        value: 'ft',
        sortable: false
      }
    ]],
    ['WorkExp',[
      {
        text: 'Date',
        value: 'date',
        sortable: true
      },
      {
        text: 'File Name',
        value: 'fn',
        sortable: false
      },

      {
        text: 'File Type',
        value: 'ft',
        sortable: false
      }
    ]],
    ['Volunteer',[
      {
        text: 'Date',
        value: 'date',
        sortable: true
      },
      {
        text: 'File Name',
        value: 'fn',
        sortable: false
      },

      {
        text: 'File Type',
        value: 'ft',
        sortable: false
      }
    ]],
    ['Record', [
      {
        text: 'Date',
        value: 'date',
        sortable: true
      },
      {
        text: 'File Name',
        value: 'fn',
        sortable: false
      },

      {
        text: 'File Type',
        value: 'ft',
        sortable: false
      }
    ]]
  ]),

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

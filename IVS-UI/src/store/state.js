// https://vuex.vuejs.org/en/state.html

export default {
  //user info
  userInfo: null,
  myChannels: [],

  //asset header map
  assetHeadersMap: new Map([
    ['Education', [
      {
        text: 'School',
        value: 'school',
        sortable: false
      },

      {
        text: 'Major',
        value: 'major',
        sortable: false
      },

      {
        text: 'From',
        value: 'from',
        sortable: false
      },

      {
        text: 'To',
        value: 'to',
        sortable: false
      }
    ]],
    ['WorkExp', [
      {
        text: 'Company',
        value: 'cname',
        sortable: false
      },

      {
        text: 'From',
        value: 'workfrom',
        sortable: false
      },

      {
        text: 'To',
        value: 'workto',
        sortable: false
      },

      {
        text: 'Job Title',
        value: 'job',
        sortable: false
      },

      {
        text: 'Job Duty',
        value: 'jobduty',
        sortable: false
      }
    ]],
    ['VolunteerRecord', [
      {
        text: 'Event Name',
        value: 'evetn name',
        sortable: false
      },

      {
        text: 'Hold By',
        value: 'holde by',
        sortable: false
      },

      {
        text: 'Description',
        value: 'desc',
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

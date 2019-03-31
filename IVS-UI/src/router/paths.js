/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  // {
  //   path: '/dashboard',
  //   // Relative to /src/views
  //   view: 'Dashboard'
  // },
  {
    path: '/dashboard',
    view: 'Home'
  },
  {
    path: '/user-profile',
    name: 'User Profile',
    view: 'UserProfile'
  },
  {
    path: '/table-list',
    name: 'Table List',
    view: 'TableList'
  },
  {
    path: '/typography',
    view: 'Typography'
  },
  {
    path: '/icons',
    view: 'Icons'
  },
  {
    path: '/maps',
    view: 'Maps'
  },
  {
    path: '/notifications',
    view: 'Notifications'
  },
  {
    path: '/upgrade',
    name: 'Upgrade to PRO',
    view: 'Upgrade'
  },
  {
    path: '/channelManagement',
    name: 'Channel Group Management',
    view: 'ChannelManagement'
  },
  {
    path: '/recordPermissions',
    name: 'Record Permissions Setting',
    view: 'RecordPermissions'
  }
]

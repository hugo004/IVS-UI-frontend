import Vue from 'vue'
import Vuetify from 'vuetify'
import theme from './theme'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'


// import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
// import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader


Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme
})

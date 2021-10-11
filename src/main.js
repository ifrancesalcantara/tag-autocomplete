import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

import Vuetify, {
  VApp,
  VDivider,
  VFlex,
  VLayout,
  VList,
  VListItem,
  VListItemTitle,
  VMain,
  VFadeTransition,
  VMenu,
  VTextarea
} from 'vuetify/lib'
import en from 'vuetify/es5/locale/en'
import es from 'vuetify/es5/locale/es'
import 'vuetify/dist/vuetify.min.css'

import { i18n } from './locale'

import VueResource from 'vue-resource'

Vue.config.productionTip = false

const vuetifyOpts = {
  lang: {
    locales: { en, es },
    current: (navigator.language || navigator.userLanguage).split('-')[0] === 'es' ? 'es' : 'en'
  }
}

Vue.use(Vuetify, {
  components: {
    VApp,
    VDivider,
    VFlex,
    VLayout,
    VList,
    VListItem,
    VListItemTitle,
    VMain,
    VFadeTransition,
    VMenu,
    VTextarea
  }
})

Vue.use(VueResource)

new Vue({
  router,
  store,
  vuetify: new Vuetify(vuetifyOpts),
  i18n,
  render: h => h(App)
}).$mount('#app')

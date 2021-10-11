import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en'
import es from './es'

Vue.use(VueI18n)
const messages = {
  en: en,
  es: es
}
export const i18n = new VueI18n({
  locale: (navigator.language || navigator.userLanguage).split('-')[0] === 'es' ? 'es' : 'en',
  messages
})
import Vue from 'vue'
import { TagRequests } from '@/services/tag.requests'
const tagService = new TagRequests()

const state = {
  list: []
}

const actions = {
  list ({ commit }, { search, save }) {
    if (save) commit('resetList')
    return new Promise((resolve, reject) => {
      tagService.list(search).then((tags) => {
        if (save) commit('setList', tags)
        resolve(tags)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

const mutations = {
  resetList (state) {
    Vue.set(state, 'list', [])
  },
  setList (state, list) {
    Vue.set(state, 'list', )
    state.list = list
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

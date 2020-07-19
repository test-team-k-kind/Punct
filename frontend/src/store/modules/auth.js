import router from '@/router/index.js'

import {
  CREATE,
  DESTROY,
  SET_NAME,
  TEST_LOGIN,
  GET,
  POST,
  DELETE,
} from '../mutation-types'

export default {
  namespaced: true,
  state: {
    userName: {},
  },
  mutations: {
    [SET_NAME](state, { name, is_test }) {
      state.userName = { name, is_test }
    },
    [DESTROY](state) {
      state.userName = ''
    }
  },
  actions: {
    [CREATE]({ commit, dispatch }, data) {
      dispatch(
        `http/${POST}`,
        { url: 'auth', data },
        { root: true }
      ).then(res => { // res.data = { message, name } or { errors }
        let name = res.data.name
        if (name) {
          commit(SET_NAME, name)
          dispatch(
            `message/${CREATE}`,
            { flash: res.data.message },
            { root: true }
          )
          router.push('/')
        } else {
          dispatch(
            `message/${CREATE}`,
            { errors: res.data.errors },
            { root: true }
          )
        }
      }).catch(err => err)
    },
    [TEST_LOGIN]({ commit, dispatch }) {
      dispatch(
        `http/${POST}`,
        { url: 'auth/test' },
        { root: true }
      ).then(res => { // res.data = { message, name }
        let name = res.data.name
        if (name) {
          commit(SET_NAME, name)
          dispatch(
            `message/${CREATE}`,
            { flash: res.data.message },
            { root: true }
          )
          router.push('/')
        }
      }).catch(err => err)
    },
    [DESTROY]({ commit, dispatch }) {
      dispatch(
        `http/${DELETE}`,
        { url: 'auth' },
        { root: true }
      ).then(res => {
        commit(DESTROY)
        dispatch(
          `message/${CREATE}`,
          { flash: res.data.message },
          { root: true }
        )
        router.push('/login')
      }).catch(err => err)
    },
    [SET_NAME]({ commit, dispatch }) {
      return dispatch(
        `http/${GET}`,
        { url: 'auth/name' },
        { root: true }
      ).then(res => {
        let userName = res.data.name
        if (userName) { commit(SET_NAME, userName) }
      }).catch(err => err)
    },
  }
}

import Vue from 'vue'
import Vuex from 'vuex'
import DailyTasks from './modules/DailyTasks'
import WeeklyTasks from './modules/WeeklyTasks'
import MonthlyTasks from './modules/MonthlyTasks'
import user from './modules/user'
import auth from './modules/auth'
import reset from './modules/reset'
import http from './modules/http'
import message from './modules/message'
import { SET_TASKS, GET } from './mutation-types'

Vue.use(Vuex)

export const index = {
  modules: {
    daily: DailyTasks,
    weekly: WeeklyTasks,
    monthly: MonthlyTasks,
    auth,
    user,
    reset,
    http,
    message
  },
  actions: {
    [SET_TASKS]({ commit, dispatch }) {
      dispatch(
        `http/${GET}`,
        { url: 'tasks' }
      ).then(res => {
        commit(`daily/${SET_TASKS}`, res.data.tasks.daily, { root: true })
        commit(`weekly/${SET_TASKS}`, res.data.tasks.weekly, { root: true })
        commit(`monthly/${SET_TASKS}`, res.data.tasks.monthly, { root: true })
      }).catch(err => err)
    },
  }
}

export default new Vuex.Store(index)

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    userLogin(state, params) {
      state.token = params.token;
      localStorage.setItem("token", params.token);
    },
  },
  actions: {
    userLogin({ commit }, params) {
      commit("userLogin", params);
    },
  },
  modules: {},
});

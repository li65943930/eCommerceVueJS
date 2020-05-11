import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    shoppingCartId: "",
    username: "",
    products: []
  },
  mutations: {
    // update the logged in state
    isLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    // update the username
    username(state, username) {
      state.username = username;
    },
    shoppingCartId(state, id) {
      state.shoppingCartId = id;
    },
    setProduct: (state, data) => {
      state.products = data;
    },
  },
  actions: {
    getProducts: context => {
      return new Promise(resolve => {
        axios.get("http://localhost:8081/api/Products").then(res => {
          context.commit("setProduct", res.data.Content);
          resolve();
        });
      });
    }
  },
  modules: {},
  getters: {
    getProduct: state => id => {
      return state.products.find(product => product._id === id);
    },
    getList: state => typeId => {
      return state.products.filter(product => product.ProductTypeId === typeId);
    }
  },
  plugins: [new VuexPersistence({storage: window.sessionStorage}).plugin]
});
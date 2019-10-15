import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state:{
    flShowSelectOption: false,
    currentEnv:'',
    isMobile:false,
    validatorTabIndex:0,
    flShowIpt:false,
    isNetWork:false,
  },
  mutations:{
    flShowSelectOption(state,data){
      state.flShowSelectOption = data
    },
    currentEnv(state,data){
      state.currentEnv = data
    },
    isMobile(state,data){
      state.isMobile = data
    },
    isNetWork(state,data){
      state.isNetWork = data
    },
    validatorTabIndex(state,data){
      state.validatorTabIndex = data
    },
    flShowIpt(state,data){
      state.flShowIpt = data
    }
  }
})
export default store

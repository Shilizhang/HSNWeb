import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import TransactionsDetail from './components/TransactionsDetail.vue';
import BlocksDetail from './components/BlockInfo.vue';
import AddressPage from './components/AddressPage.vue';
import ValidatorDetail from './components/ValidatorDetail.vue';
import ValidatorListPage from "./components/ValidatorListPage.vue";
import BlockList from "./components/BlockListPage.vue"
import TxList from "./components/TxListPage.vue";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/blocks', component: BlockList
    },
    // {
    //   path: '/txs/:txType', component: TxList
    // },
    {
      path: '/txs', component: TxList
    },
    {
      path: '/validators', component: ValidatorListPage
    },
    {
      path: '/tx', component: TransactionsDetail
    },
    {
      path: '/block/:height', component: BlocksDetail,
    },
    {
      path: '/address/:param',
      component: AddressPage,
    },
    {
      path: '/validators/:param',
      component: ValidatorDetail,
    },
  ]

})
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('Show_faucet') === '0') {
    if (to.path === '/faucet') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router;
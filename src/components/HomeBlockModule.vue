<template>
  <div class="home_module_block">
    <div class="home_module_block_title_wrap">
      <span class="home_module_block_title"
            :class="homeModuleBlockTitle"
      >{{moduleName}}</span>
      <router-link class="view_all_btn" :to="moduleName === 'Blocks' ? `/blocks` : `/txs`">
        <span class="view_all_Content">more</span>
      </router-link>
    </div>
    <div class="home_module_block_content">
      <div class="content" >
        <ul class="home_module_block_content_table">
          <li class="home_module_block_content_table_header">
            <p style="padding-left: 0.1rem; flex: .2">Height</p>
            <p style="flex: .45; width: .4rem" :class="moduleName === 'Blocks'?  'home_module_block_content_table_header_Proposer' : 'home_module_block_content_table_header_Tx Hash'"> {{moduleName === 'Blocks'?  'Proposer' : 'Tx Hash'}}</p>
            <p style="flex: .18">{{moduleName === 'Blocks'?'Txs' : 'Result'}}</p>
            <p class="home_module_block_content_table_time" style="padding-right: 0.1rem; flex: .4">Time</p>
          </li>
          <li class="home_module_block_content_table_content" v-for="(item,index) in information" :key="index">
            <div style="padding-left: 0.1rem; flex:.2">
              <router-link :to="`/block/${item.Height}`" style="color: #3598db !important;">{{item.Height}}</router-link>
            </div>
            <div style="flex: .45;">
              <router-link :to="item.Proposer?`/validators/${item.Proposer}`:`/tx?txHash=${item.TxHash}`" style="color: #3598db !important;">
                {{item.Proposer? omitForm(item.Proposer,'proposer') : omitForm(item.TxHash,'txHash')}}

              </router-link>
            </div>
            <div v-if="item.Txs"  style="flex: .18">
              {{item.Txs}}
            </div>
            <div v-else  style="flex: .2">
              <img v-if="item.Result" src="../assets/result-success.png" alt="">
              <img v-else src="../assets/result-fail.png" alt="">
              {{item.Result? 'Success': 'Fail'}}
            </div>
            <div class="home_module_block_content_table_time"  style="padding-right: 0.1rem; flex:.4">
                {{item.Time}}<br>
                {{`(Last ${item.ago} ago)`}}
            </div>
          </li>

        </ul>
        <div class="none_data_img_container" v-if="information.length === 0">
          <div class="nodata_img_content">
            <div>
              <img src="../assets/nodata.png">
            </div>
            <span v-show="moduleTitle !== 'blocks'">No Transaction</span>
            <span v-show="moduleTitle === 'blocks'">No Block</span>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
  import Tools from '../util/Tools';
  export default {
    name: 'home-block-module',
    
    watch:{
    },
    data() {
      return {
        deviceType: window.innerWidth,
        homeModuleBlockTitle: this.moduleName === 'Blocks'?'blocks_background_img':'transactions_background_img',
        moduleTitle: this.moduleName === 'Blocks'?'blocks':'transactions',
        innerWidth : window.innerWidth,
      }
    },
    props:['moduleName','information'],
    beforeMount() {

    },
    mounted() {
      window.addEventListener('resize',this.onresize);
    },
    beforeDestroy(){
      window.removeEventListener('resize',this.onresize);
    },

    methods: {
      onresize(){
        this.innerWidth = window.innerWidth;
      },
      omitForm(val,type) {
        if (!val) return val
        if(type === 'proposer') {
          return val.length > 20? val.slice(0,20) + '...':val ;
        } else if(type === 'txHash') {
          return val.slice(0,6) + '...' + val.slice(-6)
        } 
      },
    }
  }
</script>
<style lang="scss">
  @import '../style/mixin.scss';

.home_module_block_content_table {
  min-width: 4.1rem;
  line-height: 0.6rem;
  .home_module_block_content_table_time {
    text-align: right;
    line-height: 0.3rem;
  }
  .home_module_block_content_table_content {
    @include flex;
    justify-content: space-between;

    &:nth-child(2n) {
      background: #F5F9FB;
    }
  }
}


  .module_item_wrap_mobile
  .home_module_item .home_module_block
  .home_module_block_content
  .home_module_block_content_item{
    height: auto!important;
  }
  .home_module_block_content{
    .content{
      // max-width: 5.9rem;
      margin: 0 0.2rem;
      overflow-y: hidden;
      .animation{
        animation:translational_animation 1.1s infinite;
      }
    }
  }
  @keyframes translational_animation{
    from{transform: translateY(-0.59rem);}
    to{transform: translateY(0)}
  }
  .none_data_img_container{
    width: 100%;
    height: 100%;
    min-height: 4rem;
    position: relative;
    top: -0.2rem;
    .nodata_img_content{
      @include center;
      display: flex;
      flex-direction: column;

      div{
        margin: 0 auto;
        width: 0.84rem;
        height: 0.84rem;
        img{
          width: 100%;
        }
      }
      span{
        text-align: center;
        padding-top: 0.16rem;
        @include fontSize;
        color: #a2a2ae;
      }
    }

  }
  .home_module_block{
    width:100%;
    // height:100%;
    padding-bottom: 0.2rem;
    @include flex;
    flex-direction:column;
    box-shadow: 0px 2px 6px rgba(0,0,0,0.16);
    border-radius: 0.1rem;
    .home_module_block_title_wrap{
      @include flex;
      padding:0.2rem;
      height:0.64rem;
      justify-content: space-between;
      align-items: center;
      .home_module_block_title{
        font-size:0.14rem;
        @include fontWeight;
      }
      .view_all_btn{
        @include viewBtn;
      }
    }
    #echarts_pie{
      width:100%;
      flex:1;
    }
    .home_module_block_content{
      flex:1;
      -webkit-overflow-scrolling:touch;
      .home_module_block_content_table {
        line-height: 0.6rem;
        .home_module_block_content_table_time {
          text-align: right;
          line-height: 0.2rem;
          padding: 0.1rem 0;
        }
        .home_module_block_content_table_header {
          background: none;
          @include flex;
          height: 0.4rem;
          justify-content: space-between;
          line-height: 0.4rem;
          font-weight: 0 !important;
          border-bottom: 0.01rem solid rgba(2, 148, 215, .3);
          p {
            font-size: 0.12rem;
          }
        }
        .home_module_block_content_table_content {
          @include flex;
          justify-content: space-between;
          border-bottom:0.01rem solid rgba(2,148,215,.3);
          font-size: 0.12rem;
          cursor: pointer;
          &:nth-child(2n) {
            background: #F5F9FB;
          };
          &:hover {
            background: rgba(2,148,215,.5)
          };
        }
      }
    }
  }
  .view_all_Content{
    color: #fff;
  }
</style>

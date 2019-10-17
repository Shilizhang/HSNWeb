<!--
  feature: loading,如果1000ms内没有结果返回则显示;
  use:     在父组件中引入，传入props,并且父元素设置position为relative.
  props:   showLoading:boolean 是否显示弹框
-->
<template>
  <div class="spin-component" v-show="showLoading" >
    <div class="spin-content" v-show="!network">
      <img style="with:48px;height: 48px;" src="../../assets/loading.gif">
      <p>Loading,please wait...</p>
    </div>
    <div class="spin-content" v-show="network"> 
      <img style="with:52px;height: 52px;" src="../../assets/network.png">
      <p style="font-size: .12rem;">Network error. Reload and try again</p>
    </div>
  </div>

</template>
<script>
  export default {
    name: "SpinComponent",

    data() {
      return {
        loading: false,
        network: this.$store.state.isNetWork,
      }
    },
    props: ['showLoading'],
    watch: {
        '$store.state.isNetWork'(newVal, oldVal) {
            this.network = newVal;
        }
    },

  }
</script>

<style scoped lang="scss">
  @import '../../style/mixin.scss';

  .spin-component {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    z-index: 1000;
    @include flex;
    align-items: center;
    justify-content: center;
    .spin-content {
      background: rgba(255, 255, 255, 1);
      box-shadow:0px 0px 6px 0px rgba(10, 97, 142, 0.15);
      width: 2.54rem;
      height: 1.32rem;
      @include borderRadius(0.1rem);
      @include flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {

      }
      p {
        color: #000;
        font-size: 0.14rem;
        font-family: ArialMT;
        margin-top: 0.19rem;
      }
    }
  }

</style>

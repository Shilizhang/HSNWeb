<template>
  <div :style="{'marginBottom':'0.2rem'}" class="vail_center">
    <div class="vail_search">
			<input type="text" placeholder="Search By Validator" @input="search" ref="search" >
      <ul>
        <li v-for="(item,key) in validatorStatusTitleList" 
          :key= "key" 
          :class="item.isActive?'vail_tab_filter':''"
          @click="selectValidatorStatus(key)">
          {{item.title}}
        </li>
      </ul>
    </div>

    <div style="padding: .1rem 0; overflow-x: auto; margin:0 0.2rem;">
      <m-table 
              :columns="validatorFields"
              :data="itemsData "
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :type="'vaildator'"
              >
        <template slot-scope="{ row }"
                  slot="moniker">
          <div>
            <img v-if="row.url"
                style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;"
                :src="row.url ? row.url : ''" />
            <router-link style="margin-left: 0.1rem;"
                        :to="'/validators/' + row.address"
                        class="link_style">{{row.moniker}}</router-link>
          </div>
        </template>
        <template slot-scope="{ row }"
                  slot="votingPower">
          <span >
            <div style="height: 0.3rem; line-height: 0.4rem;">{{row.votingPower.split('r')[0]}}</div>            
            <div style="height: 0.3rem; line-height: 0.2rem;">{{row.votingPower.split('r')[1]}}</div>            
          </span>
        </template>
      </m-table>
    </div>
  </div>
</template>

<script>
import Tools from '../../util/Tools';
import ValidatorListTable from "./ValidatorListTable";
export default {
  name: 'MValidatorListTable',
  props: {
    items: {
      type: Array,
      default: []
    },
    showNoData: {
      type: Boolean,
      default: true
    },
    minWidth: {
      type: Number,
      default: 12
    }
  },
  data () {
    return {
      itemsData:[],
      validatorFields: [],
      sortBy: 'votingPower',
      sortDesc: true,
      validatorStatusTitleList:[
					{
						 title:'Active',
						isActive: true,
					},
					{
						title:'Candidate',
						isActive: false,
					},
					{
						title:'Jailed',
						isActive: false,
					}
      ],
      activeValidatorFields: [
        {
          title: 'Rank',
          key: 'rank',
          sortable: true,
          className: 'text_left'
        },
        {
          title: 'Validator',
          slot: 'moniker',
          sortable: true,
        },

        {
          title: 'Voting_Power',
          slot: 'votingPower',
          sortable: true,
          sortMethod: this.sortMethodPower('votingPower'),
          className: 'text_right'
        },
        { // +++++++++++++++++
          title: 'Cumulative Share%',
          key: 'CumulativeShare',
          sortable: true,
          sortMethod: this.sortMethodPer('CumulativeShare'),
          className: 'text_right'

        },
        {
          title: 'Commission_Rate',
          key: 'commission',
          sortable: true,
          sortMethod: this.sortMethodPer('commission'),
          className: 'text_right'
        },
        {
          title: 'Uptime',
          key: 'uptime',
          sortable: true,
          sortMethod: this.sortMethodPer('uptime'),
          className: 'text_right'
        },
      ],
    }
  },
  methods: {
    // 根据用户名搜索
    search (e) {
      let timeout = null;
      let arr = this.items;
      let that = this
      //防抖
      clearTimeout(timeout)
      timeout = setTimeout(()=>{
        let val = e.target.value;
        if(!val) return that.itemsData = that.items
        arr = arr.filter((item)=>{
          return item.moniker.includes(val)
        });
        that.itemsData = arr
      },1000)
    },
    //切换
    selectValidatorStatus(index){
      index = index || 0;
      this.validatorStatusTitleList.forEach( item => {
        item.isActive = false
      });
      this.validatorStatusTitleList[index].isActive = true;

      this.$emit('getDataList',this.validatorStatusTitleList[index].title.toLowerCase())
      //切换类型之后清空储存筛选出来的数据
      this.itemsData = [];
      this.$refs.search.value = ''
    },
    sortMethodPer (key) {
        return (a, b) => Number(a[key].split('%')[0]) - Number(b[key].split('%')[0]);
    },
    sortMethodPower (key) {
        return (a, b) => Number(a[key].split('r')[0]) - Number(b[key].split('r')[0])
    },
    sortMethodNumber (key) {
      return (a, b) => Number(a[key]) - Number(b[key]);
    },
    sortMethodSplit (key) {
      return (a, b) => Number(a[key].replace(/\,/g, '').split(' ')[0]) - Number(b[key].replace(/\,/g, '').split(' ')[0]);
    },
    formatAddress (address) {
      return Tools.formatValidatorAddress(address);
    },
    setValidatorField (status) {
      switch (status) {
        case 'validator':
          this.validatorFields = this.activeValidatorFields;
          break;
        case 'candidate':
          this.validatorFields = this.candidateValidatorFields;
          break;
        case 'jailed':
          this.validatorFields = this.jailedValidatorFields;
          break;
      }
    }
  },
  mounted () {
    this.validatorFields = this.activeValidatorFields;
  },
  beforeDestroy () {
    let defaultValidatorTabIndex = 0;
  }
}
</script>

<style lang="scss">
@import '../../style/mixin.scss';
.operator_address_style{
  font-family: "Consolas","Arial",-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.vail_center {
      overflow-x: auto;
  .vail_search {
    min-height: 0.76rem;   
    width: 100%;
    padding: .2rem .1rem 0 .1rem;
    @include flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    input {
      width: 4.32rem;
      height: 0.36rem;
      border:0.01rem solid #0294D7;
      outline: none;
      border-radius: 0.05rem;
      padding: 0.12rem;
      margin-bottom: .1rem;
    }
    ul {
      margin-bottom: .1rem !important;
      min-width: 2.8rem;
      @include flex;
      justify-content: space-around;
      li {
        width: 0.9rem;
        height: 0.36rem;
        border: 0.01rem solid #0294D7;
        text-align: center;
        line-height: 0.36rem;
        border-radius:0.05rem;
        cursor: pointer;
        // &:hover {
        //   background: #0294D7;
        //   color:white;
        // }
      }
      .vail_tab_filter {
        background: #0294D7;
        color:white;        
      }
    }
  }
}
@media screen and (min-width: 780px) {
  .vail_center {
    .vail_search {
      input {
        margin-right: .1rem;
      }
    }
  }
}
</style>

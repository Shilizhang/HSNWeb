<template>
  <div :style="{opacity: show ? 1 : 0,'min-width':type === 'vaildator'?'5.93rem':'5.5rem'}" ref="tableContainer" >
    <div class="m-table-header">
      <table :class="['m_table', data.length > 0 ? 'm-table-header-table-fixed' : '']"
             cellspacing="0"
             cellpadding="0"
             border="0"
             ref="tableHeader">
        <colgroup>
          <col v-for="(v, i) in colWidth"
               :key="i"
               :style="{width: (columns[i] && columns[i].width) ? columns[i].width+ 'px' : v + 'px', 
              minWidth: columns[i] && columns[i].minWidth + 'px', 
              maxWidth: columns[i] && columns[i].maxWidth + 'px'}" />
        </colgroup>
        <thead>
          <tr>
            <th :class="[v.className, v.sortable ? 'sorting' : '']"
                @click="sortDataByClick(v)"
                v-for="(v, i) in columns"
                :key="i">{{v.title}}
              <i class="sort"
                 v-if="v.sortable"
                 :class="{'desc': (v.key === sortAsBy || v.slot === sortAsBy) && sortAsDesc, 
              'asc': (v.key === sortAsBy || v.slot === sortAsBy) && !sortAsDesc}"></i>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="m-table-body">  
      <table class="m_table"
             cellspacing="0"
             cellpadding="0"
             border="0">
        <thead class="hidden_thead">
          <tr>
            <th v-for="(v, i) in columns"
                :key="i">{{v.title}}
              <i></i>
            </th>
          </tr>
        </thead>
        <tbody ref="table_body">
          <tr v-for="(v, i) in data"
              :key="i">
            <td v-for="(it, j) in columns"
                :width="it.width"
                :key="j"
                :class="it.className">
              <template v-if="it.key">
                <!--  新增class名字修改序号bg  -->
                <div :class="it.key === 'rank'?it.key === 'rank' && v[it.key] <= 10? 'add_rank_bg': 'rank_bg' :''" v-table-tooltip="{show: it.tooltip || v[`${it.key || it.slot}_tooltip`], container: $refs.tableContainer}">
                <!-- <div :class="{'tooltip_span_container': it.tooltip || v[`${it.key || it.slot}_tooltip`], }" v-table-tooltip="{show: it.tooltip || v[`${it.key || it.slot}_tooltip`], container: $refs.tableContainer}"> -->
                   {{v[it.key]}}
                   
                  <!-- <div class="tooltip_span"
                       :class="it.tooltipClassName"
                       v-if="it.tooltip || v[`${it.key || it.slot}_tooltip`]">
                    <div>
                      {{it.tooltip === true ? (v[it.key || it.slot]) : v[`${it.key || it.slot}_tooltip`]}}
                    </div>
                    <i></i>
                  </div> -->
                </div>
              </template>
              <template v-else>
                  <div :class="{'tooltip_span_container': it.tooltip || v[`${it.key || it.slot}_tooltip`]}" v-table-tooltip="{show: it.tooltip || v[`${it.key || it.slot}_tooltip`], container: $refs.tableContainer}">
                  <slot :name="it.slot"
                        :row="v">
                  </slot>
                  <div class="tooltip_span"
                       :class="it.tooltipClassName"
                       v-if="it.tooltip || v[`${it.key || it.slot}_tooltip`]">
                    <div>
                        {{it.tooltip === true ? (v[it.key || it.slot]) : v[`${it.key || it.slot}_tooltip`]}}
                    </div>
                    <i></i>
                  </div>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MTable',
  props: {
    columns: {
      type: Array,
      default: [],

    },
    data: {
      type: Array,
      default: []
    },
    sortBy: {
      type: String,
      default: ''
    },
    sortDesc: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 1200
    },
    type:{
      type: String,
      default:''
    },
  },
  data () {
    return {
      show: false,
      colWidth: [],
      sorted: false,
      sortAsBy: '',
      sortAsDesc: true,
      columnsChange: true,
      
    }
  },
  watch: {
    data (newVal, oldVal) {
      this.$nextTick(() => {
        this.sortData();
        this.columnsChange = true;
        this.computedColWidth();
      });
    },
    columns (newVal, oldVal) {
      this.columnsChange = true;
      this.sorted = false;
    },
    width() {
      setTimeout(() => {
        this.columnsChange = true;
        this.computedColWidth();
      });
    }
  },
  methods: {
    computedColWidth () {
      this.$nextTick(() => {
        if (!this.columnsChange) {
          return;
        }
        let e = this.$refs.table_body && this.$refs.table_body.querySelector('tr');
        if (!e) {
          this.show = true;
          return;
        }
        let arr = [];
        [].slice.call(e.childNodes).forEach(v => {
          arr.push(v.offsetWidth);
        });
        this.colWidth = arr;
        this.show = true;
        this.columnsChange = false;
      });
    },
    sortData () {
      if (this.sortAsBy && !this.sorted && this.columns.find(v => this.sortAsBy === (v.key || v.slot) && v.sortable)) {
        let col = this.columns.find(v => (v.key === this.sortAsBy || v.slot === this.sortAsBy));
        let func = col && col.sortMethod;
        if (func) {
          this.selectionSort(this.data, func);
        } else {
          this.defaultSortFunc();
        }
        this.sorted = true;
      }
    },
    defaultSortFunc () {
      this.selectionSort(this.data, (a, b) => {
        let v = a[this.sortAsBy] > b[this.sortAsBy] ? 1 : -1;
        return v;
      });
    },
    sortDataByClick (v) {
      if (!v.sortable) {
        return;
      }
      this.sortAsDesc = this.sortAsBy === (v.key || v.slot) ? !this.sortAsDesc : false;
      this.sortAsBy = (v.key || v.slot);
      this.sorted = false;
      this.sortData();
    },
    selectionSort (arr, method) {
      let len = arr.length;
      let minIndex, temp;
      for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
          if (this.sortAsDesc) {
            if (method(arr[j], arr[minIndex]) > 0) {//寻找最小的数
              minIndex = j;//将最小数的索引保存
            }
          } else {
            if (method(arr[j], arr[minIndex]) < 0) {
              minIndex = j;
            }
          }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
      }
      //排序后 对Cumulative Share 重新计算
      this.data.forEach((item,index,arr)=>{
        if(index) {
          item.CumulativeShare = '0%'
          let num = Number(item.votingPower.split('r')[1].split('%')[0])
          let num1 = Number(arr[index-1].CumulativeShare.split('%')[0])
          item.CumulativeShare = (num + num1).toFixed(2) + '%'
        }else {
          item.CumulativeShare = item.votingPower.split('r')[1]
        }
      })
      return arr;
    }
  },
  mounted () {
    this.computedColWidth();
},
  created () {
    this.sortAsBy = this.sortBy;
    this.sortAsDesc = this.sortDesc;
  },
  updated () {
  }
}
</script>

<style lang="scss">
table.m_table {
  width: 100%;
  max-width: 11.6rem;
  .hidden_thead {
    position: relative;
    bottom: 0.02rem;
    line-height: 0px;
    color: transparent;
    border-color: transparent;
    tr {
      border-top-width: 0;
      
			th {
				white-space: nowrap;
				i {
					width: 10px;
					height: 1px;
				}
			}
    }
  }
}
.text_right {
  text-align: right;
  padding-right: 0.1rem;
}
.text_left {
  padding-left: 0.1rem;
}
.type {
  div {
    height: 0.2rem;
    background: #0294D7;
    line-height: 0.2rem;
    color:white;
    padding: 0 0.1rem;
    border-radius: 0.1rem;
  }
}
.m-table-header {
  position: relative;
  // z-index: 2;
  max-width: 11.6rem;
  background-color: #ffffff;
  // .m-table-header-table-fixed {
  //   table-layout: fixed;
  // }
  table {
    color: rgb(0, 0, 0);
    thead {
      max-width: 11.6rem;
      tr {
        // border-left: 1px solid #dee2e6;
        // border-right: 1px solid #dee2e6;
        height: 50px;
        border-bottom: 0.01rem solid #0294D7;
        th {
          box-sizing: border-box;
          font-weight: 500 !important;
          vertical-align: middle;
          white-space: nowrap;
        }
        th.sorting {
          cursor: pointer;
          .sort {
            display: inline-block;
            vertical-align: middle;
            &::before {
              display: block;
              content: "";
              border-width: 0px 5px 6px;
              border-color: transparent;
              border-style: solid;
              border-bottom-color: #acacb6;
            }
            &::after {
              display: block;
              content: "";
              margin-top: 2px;
              border-width: 6px 5px 0px;
              border-color: transparent;
              border-style: solid;
              border-top-color: #acacb6;
            }
          }
          .desc {
            &::after {
              border-top-color: #3598db;
            }
          }
          .asc {
            &::before {
              border-bottom-color: #3598db;
            }
          }
        }
        
      }
    }
  }
}
.m-table-body {
  margin-top: -0.08rem;
  tbody {
    border-bottom: 1px solid #dee2e6;
  }
  tr {
      border-bottom:0.01rem solid #3598db;
      cursor:pointer;
      
    td {
      font-size: 0.12rem;
      height: 0.6rem;
      line-height: 0.57rem;
      box-sizing: border-box;
      color: #a2a2ae;
      & > div {
        display: inline-block;
        vertical-align: middle;
      }
    }
    &:nth-of-type(2n + 1) {
      td {
        background-color: #F5F9FB;
      }
    }
    &:nth-of-type(2n) {
      td {
        background-color: #ffffff;
      }
    }
    &:hover {
      td {
        background-color: rgba(2,148,215,.5) !important;
      }
    };
    
  }
  .rank_bg,.add_rank_bg {
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    border: 0.01rem solid #707070;
    line-height: 0.3rem;
    text-align: center;
    color: #707070;
  }
  .add_rank_bg {
    border: 0.01rem solid #0294D7;
    background: #0294D7;
    color: white;
  }
  .tooltip_span_container {
    position: relative;
    display: inline-block;
    cursor: pointer;
    &:hover .tooltip_span {
      display: block;
      position: fixed;
      opacity: 0;
    }
    .tooltip_span {
      display: none;
      z-index: 1000;
      color: #ffffff;
      background-color: #000000;
      border-radius: 0.04rem;
      line-height: 16px;
      div {
        padding: 8px 15px;
      }
      & > i {
        width: 0;
        height: 0;
        border: 0.06rem solid transparent;
        content: "";
        display: block;
        position: absolute;
        border-top-color: #000000;
        margin-left: -6px;
      }
    }
    .tooltip_span_word_warp {
      word-break: break-all;
      word-wrap: break-word;
      white-space: normal;
    }
    a {
      color: #3598db !important;
    }
  }
}
.text_overflow { //表格文字太多，超范围隐藏class
  & > div {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.override_mtable {
  .m-table-header {
    // position: fixed;
    // margin-top: -0.45rem;
    background-color: #ffffff;
  }
  .m-table-body {
    // margin-top: 0.45rem;
  }
}
@media screen and (max-width: 910px) {
  .m-table-header {
    position: static !important;
    margin-top: 0rem !important;
  }
  // .m-table-body {
  //   margin-top: -0.03rem !important;
  // }
}
</style>
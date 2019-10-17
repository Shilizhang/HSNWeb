<template>
  <div :class="showNoData?'show_no_data':''"
       style="max-width: 11.6rem; margin: 0 .1rem; min-width: 5.9rem; "
       class="validator_table">
    <b-table :borderless="true" :fields='listFields'
             :items='items'
             striped
             nodelabel
             :class="flIsValidatorTable ? 'validator_set_table_style' : ''">
      <template slot='Tx_Hash'
                slot-scope='data'>
        <div class="common_hover_parent"
             v-if="data.item.Tx_Hash">
          <router-link :to="`/tx?txHash=${data.item.Tx_Hash}`"
                       class="link_style common_font_style">{{formatTxHash(data.item.Tx_Hash)}}
            <div class="hover_content">
              {{data.item.Tx_Hash}}
            </div>
          </router-link>
        </div>
      </template>
      <template slot='Block'
                slot-scope='data'>
        <span class="skip_route">
          <router-link :to="`/block/${data.item.Block}`">{{data.item.Block}}</router-link>
        </span>
      </template>
      <template slot='Timestamp'
                slot-scope='data'>
        <span class="skip_route">
          <div style="line-height: 0.2rem;">{{data.item.Timestamp.split(",")[0]}}</div>
          <div style="line-height: 0.1rem;">{{data.item.Timestamp.split(",")[1]}} ago </div>
          
        </span>
      </template>
      <template slot='Tx_Type'
                slot-scope='data'>
        <span style="background:#0294D7; color: white; border-radius: 0.2rem; padding:0 0.1rem;">
          {{data.item.Tx_Type}}
        </span>
      </template>
      <template slot="Tx_Status"
                slot-scope="data">
        <span>
          <img v-if="data.item.Tx_Status === 'Success'" src="../../assets/result-success.png" alt="">
          <img v-else src="../../assets/result-fail.png" alt="">
          {{data.item.Tx_Status}}
        </span>
      </template>
      <template slot-scope= "data" slot="Amount">
          <div v-if="data.item.num > 1" class="common_hover_address_parent">
            <router-link :to="`/tx?txHash=${data.item.Tx_Hash}`" class="link_style">more</router-link>
            </div>
				<div v-else class="common_hover_address_parent">
					{{data.item.Amount + ' HSN'}}
            </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import Tools from '../../util/Tools';
export default {
  name: "BlockDetailListTable.vue",
  props: ['items', 'governanceList', 'validatorSetList', 'validatorType', 'type', 'showNoData', 'minWidth', 'status'],
  watch: {
    items (items) {
      this.formatListName(items)
    },
    governanceList (governanceList) {
      this.formatListName(governanceList)
    },
    validatorSetList (validatorSetList) {
    }
  },
  data () {
    return {
      listFields: {},
      transferFields: {
        'Tx_Hash': {
          label: 'Tx Hash'
        },
        'Block' : {
          label: 'Height'

        },
        'Tx_Type': {
          label: 'Type'
        },
        'Tx_Status': {
          label: 'Result'
        },
        'Amount': {
          label: 'Amount'
        },
        'Tx_Fee': {
          label: 'Fee'
        },
        'Timestamp': {
          label: 'Time'
        }
      },
      flIsValidatorTable: false,
    }
  },
  mounted () {
  },
  methods: {
    formatAddress (address) {
      if (address) {
        return Tools.formatValidatorAddress(address)
      }
    },
    formatTxHash (TxHash) {
      if (TxHash) {
        return Tools.formatTxHash(TxHash)
      }
    },
    formatMoniker (moniker) {
        if (!moniker) {
            return '';
        }
        return Tools.formatString(moniker,15,"...");
    },
    formatListName (items) {
      items.forEach((tx) => {
        if (tx.listName === 'transfer') {
          this.listFields = this.transferFields
        } else if (tx.listName === 'declarations') {
          this.listFields = this.declarationFields
        } else if (tx.listName === 'stakes') {
          this.listFields = this.stakeFields
        } else if (tx.listName === 'gov') {
          this.listFields = this.govFields
        } else {
          this.listFields = this.validatorFields;
          this.flIsValidatorTable = true
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../style/mixin.scss";
.validator_table table {
  td {
    max-width: none !important;
    overflow-wrap: break-word !important;
    word-wrap: break-word !important;
    line-height: 0.3rem;
  }
}
.validator_table .validator_set_table_style thead tr th:nth-child(2) {
  padding-left: 0.26rem !important;
}
.validator_table {
  .table-borderless {
    thead {
      tr {
        th {
          &:last-child{
            text-align: right;
          }
        }
      }
    };
    tbody {
      tr {
        td {
          &:last-child{
            text-align: right;
          }
        }
      }
    }
  }
}
.show_no_data {
  .table {
    tbody {
      tr {
        &:first-child {
          display: none;
        }

      }
    }
  }
}
.table tbody tr {
  height: 0.3rem !important;
}
.page-item {
  &:first-child,
  &:last-child {
    .page-link {
      @include borderRadius(0.025rem);
    }
  }
}
.moniker_conent {
  display: flex;
  .proposer_img_content {
    width: 0.13rem;
    margin-right: 0.06rem;
    img {
      width: 100%;
    }
  }
}
.sequence_number_content {
  padding-left: 0.1rem;
}
.common_font_style {
  .hover_content {
    display: none;
    position: absolute;
    padding: 0rem 0.15rem;
    top: -0.36rem;
    color: #fff;
    background: rgba(0, 0, 0, 1);
    border-radius: 0.04rem;
    z-index: 10;
    line-height: 32px;
    font-size: 0.14rem;
  }
  &:hover {
    .hover_content {
      display: block;
      &::after {
        width: 0;
        height: 0;
        border: 0.06rem solid transparent;
        content: "";
        display: block;
        position: absolute;
        border-top-color: #000000;
        left: 30px;
        margin-left: -6px;
      }
    }
  }
}
</style>

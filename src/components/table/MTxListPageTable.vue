<template>
    <div>
        <m-table v-table-head-fixed class="tx_container_table override_mtable" :columns="fields" :data="items" :type="'vaildator'">
            <template slot-scope="{ row }" slot="Block">
                    <router-link :to="`/block/${row.Block}`" class="link_style">{{row.Block}}</router-link>
            </template>
            <template slot-scope="{ row }" slot="Tx_Hash">
                <div class="common_hover_parent" v-if="row.Tx_Hash">
                    <router-link :to="`/tx?txHash=${row.Tx_Hash}`" class="link_style common_font_style">{{formatTxHash(row.Tx_Hash)}}
                    </router-link>
                </div>
            </template>
			<template slot-scope= "{ row }" slot="Tx_Status">
				<div class="common_hover_address_parent">
                    <img v-if="row.Tx_Status === 'Success'" src="../../assets/result-success.png" alt="">
					<img v-else src="../../assets/result-fail.png" alt="">
					{{row.Tx_Status}}
                </div>
			</template>
			<template slot-scope= "{ row }" slot="Amount">
				<div v-if="row.num > 1" class="common_hover_address_parent">
                    <router-link :to="`/tx?txHash=${row.Tx_Hash}`" class="link_style">more</router-link>
                </div>
				<div v-else class="common_hover_address_parent">
					{{row.Amount}}
                </div>
			</template>
			<template slot-scope= "{ row }" slot="Tx_Type">
				<div class="common_hover_address_parent type" style="display: inline-block;height: 0.2rem;
					background: #0294D7;
					line-height: 0.2rem;
					color:white;
					padding: 0 0.1rem;
					border-radius: 0.1rem;">  
                    {{row.Tx_Type}} 
                </div> <span v-if="row.num > 1"> + {{row.num-1}}</span>
			</template>
        </m-table>
    </div>
</template>

<script>
    import Tools from "../../util/Tools"
	export default {
		name: "MTxListPageTable",
        props:{
	        items: {
		        type: Array,
		        default: []
	        }
        },
        data () {
			return {
				fields:null,
				transferFields: [
					{
						title:'Tx Hash',
						slot: 'Tx_Hash',
						tooltip: true,
						className:'text_left'
					},
					{
						title:'Type',
						slot: 'Tx_Type',
					},
					{
						title:'Result',
						slot: 'Tx_Status',
					},
					{
						title:'Amount',
						slot: 'Amount',
					},
					{
						title:'Fee',
						key: 'Tx_Fee',
					},
					{
						title:'Height',
						slot: 'Block',
						className: 'text_right'
					},
					{
						title:'Time',
						key: 'Timestamp',
						className: 'text_right'

					},
				],
            }
        },
        methods:{
	        formatAddress(address){
		        return Tools.formatValidatorAddress(address)
	        },
	        formatTxHash(TxHash){
		        if(TxHash){
			        return `${TxHash.substring(0,8)}...${TxHash.substring(TxHash.length - 8)}`
		        }
	        },
	        setTxFields(){
					this.fields = this.transferFields
            },
            formatMoniker (moniker) {
                if (!moniker) {
                    return '';
                }
                return Tools.formatString(moniker,13,"...");
            }
        },
		watch:{
			items(items){
				this.setTxFields();
			}
		},
	}
</script>

<style lang="scss">

    .common_hover_parent{
        a{
            display: inline-block;
            position: relative;
        }
    }
    .common_hover_address_parent{
        a{
            position: relative;
        }
    }
.common_font_style{
    font-family: Consolas;
}
</style>
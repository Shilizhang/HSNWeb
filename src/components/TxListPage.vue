<template>
    <div class="transaction_list_page_container">
        <div class="transaction_list_title_wrap">
            <div class="transaction_list_title_content">
                <span class="transaction_list_title">{{listTitleName}}</span>
            </div>
        </div>
        <div class="transaction_dash">
            <m-dash-board :item='true'></m-dash-board>
        </div>
        <div class="transaction_list_table_container">
            <div class="transaction_list_table_container_name">
                Transactions
            </div>
            <div class="transaction_list_table_content">
                <div class="table_list_content">
                    <spin-component :showLoading="flShowLoading"></spin-component>
                    <m-tx-list-page-table :items="txList"></m-tx-list-page-table>
                    <div v-show="showNoData" class="no_data_show">
                        No Data
                    </div>
                </div>
                <div class="pagination_nav_footer_content">
                    <b-pagination :total-rows="total" :per-page="perPage" v-model="currentPageNum" ></b-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import Service from "../service";
	import Tools from "../util/Tools";
	import SpinComponent from './commonComponents/SpinComponent';
    import MTxListPageTable from "./table/MTxListPageTable";
    import MDashBoard from './commonComponents/MdashBoard'
    import MPagination from "./commonComponents/MPagination";
	export default {
		name: "TransactionListPage",
		components: {MTxListPageTable, SpinComponent,MDashBoard},
		data() {
			return {
                perPage:13,
                currentPageNum:1,
				txList: [],
				listTitleName: "Transactions",
                size:13,
				showNoData: false,
                flShowLoading: false,
                total:0,
			}
		},
		mounted(){
			this.getTransactionList()
        },
        watch: {
            currentPageNum(val) {
                this.getTransactionList()
            }
        },
		methods: {
			getTransactionList(){
				let that = this;
				let	parmas = {txListTransfer: {head:0,size:this.size,page: this.currentPageNum - 1}};
				this.flShowLoading = true;
				Service.commonInterface(parmas,(txList) => {
					try {
						// this.count = txList.Count;
						if(txList.code === '0'){
                            this.txList = [];
                            txList.data.forEach(item => {
                                if(item.height) {
                                    this.txList.push({
                                        Tx_Hash: item.hash,
                                        Block: item.height,
                                        Tx_Type: item.types,
                                        Tx_Fee: item.fee,
                                        Tx_Status: item.result?'Success':'Fail',
                                        Timestamp: `Last ${Tools.tranTime(item.time)} ago`,
                                        Amount: item.amount,
                                        num:item.nums
                                    })
                                }
                            })
                            this.total = txList.total
                            this.showNoData =txList.data? false: true;
						}else{
							this.txList = [];
							this.showNoData = true;
						}
						this.flShowLoading = false;
					}catch (e) {
						console.error(e)
					}
                })
            },
		}
	}
</script>

<style scoped lang="scss">
    .transaction_list_page_container{
        padding: 0 .1rem;
        .transaction_list_title_wrap{
            width: 100%;
            // position: fixed;
            z-index: 10;
            background-color: #ffffff;
            .transaction_list_title_content{
                height:0.7rem;
                display: flex;
                align-items: center;
                max-width: 12rem;
                margin: 0 auto;
                background-color: #ffffff;
                .transaction_list_title{
                    font-size: 0.22rem;
                    font-weight: 500;
                    padding-left: 0.2rem;
                    color: #0294D7;
                }
            }
        }
        .transaction_dash {
            max-width: 12rem;
            margin: 0 auto;
        }
    }
    .transaction_list_table_container{
        max-width: 12rem;
        margin: 0.2rem auto 0;
        box-shadow:0px 2px 6px rgba(0,0,0,0.16);
        .transaction_list_table_container_name {
            height: 0.7rem;
            padding: 0.25rem;
            font-size: 0.22rem;
        }
        .transaction_list_table_content{
            .table_list_content{
                // width: 100%;
                overflow-x: auto;
                margin:0 0.2rem;
                .no_data_show{
                    display: flex;
                    justify-content: center;
                    border-top:0.01rem solid #eee;
                    border-bottom:0.01rem solid #eee;
                    font-size:0.14rem;
                    height:3rem;
                    align-items: center;
                }
            }
            .pagination_nav_footer_content{
                display: flex;
                justify-content: flex-end;
                height: 0.7rem;
                align-items: center;
                margin-bottom: 0.2rem;
                padding-right: 0.2rem;
            }

        }
    }
    @media screen and (max-width: 910px){
        .transaction_list_page_container{
            .transaction_list_title_wrap{
                position: static;
            }
        }

        .transaction_list_table_container{
            padding-top: 0;
            // padding-left: 0.1rem;
            // padding-right: 0.1rem;
            .transaction_list_table_content{
                .table_list_content{
                    margin: 0 .1rem;
                    padding-top: 0;
                }
            }
        }
    }
</style>

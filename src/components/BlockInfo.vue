<template>
    <div class="block_detail_container">
        <div class="block_detail_content">
            <div class="block_detail_title_content">
                <span class="block_height_content">
                    <span class="information_value">
                        <router-link to='/blocks' >BLOCK &nbsp;</router-link>
                        <div>&lt;</div>
                        <div style="color: #0294D7">&nbsp; Details for Block #{{heightValue}}</div>
                    </span>
                    <span class="flag_item">
                        <i class='flag_item_left' @click="skipNext(-1)"></i>
                        <i class= 'flag_item_right' @click="skipNext(1)"></i>
                    </span>
                </span>
            </div>
        </div>
        <div class="block_detail_information_container">
            <div class="block_information_header">
                Header
            </div>
            <div class="block_information_content">
                <div class="current_block_information_content">
                    <div class="block_information_item">
                        <span>Height:</span>
                        <span>{{heightValue || '--'}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>Block Time:</span>
                        <span v-if="timestampValue">{{timestampValue}}</span>
                        <span v-if="!timestampValue">--</span>
                    </div>
                    <div class="block_information_item">
                        <span>Block Hash:</span> 
                        <span>{{blockHashValue}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>Number of Transactions:</span>
                        <span>{{transactionsValue}}</span>
                    </div>
                    <div class="block_information_item">
                        <span>Proposer:</span>
                        <span><router-link class="common_link_style" :to="'/validators/'+proposerValue">{{proposerValue}}</router-link></span>

                    </div>
                </div>
            </div>
        </div>
        <div class="block_table_container">
            <div class="block_result_container">
                <div class="block_result_title">Transfers</div>
                <div class="block_result_table_content">
                    <blocks-list-table :items="items"
                                       :showNoData="flBlockTransferNoData" :min-width="tableMinWidth"></blocks-list-table>
                </div>
                <div v-show="flBlockTransferNoData" class="no_data_show">
                    No Data
                </div>
                <div class="validator_table_pagination" v-if="!flBlockTransferNoData">
                    <div class="validator_table_pagination_content">
                        <span>Rows per page: 
                            <select v-model="txSize">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </span>
                        <b-pagination size="md" :total-rows="txTotal" v-model="txCurrentPage" :per-page="txSize">
                        </b-pagination>
                        <span>total: {{txTotal}}</span>
                    </div>
                </div>
            </div>
            <spin-component :showLoading="showLoading"></spin-component>
        </div>
        <div class="blockBox" :class="showBox?'showBox':''">
            <div @click="closeBox">X</div>
            <div>{{noBlockMsg}}</div>
        </div>
    </div>
</template>

<script>
    import Tools from '../util/Tools';
    import BlocksListTable from './table/BlockDetailListTable';
    import SpinComponent from './commonComponents/SpinComponent';
    import Service from "../service";
    export default {
        components: {
            BlocksListTable,
            SpinComponent,
        },
        watch: {
           
            $route() {
                this.getBlockInformation();
                this.computeMinWidth();
               
            },
            txSize() {
                this.getTransferList();
            },
            txCurrentPage(val) {
                this.txPage = val -1
                this.getTransferList();
            }
        },
        data() {
            return {
                transactionsDetailWrap: 'personal_computer_transactions_detail',
                items: [],
                heightValue: '',
                timestampValue: '',
                blockHashValue: '',
                transactionsValue: '',
                proposerValue:'',
                txPage:0,
                txSize:5,
                txTotal:'',
                txCurrentPage:1,
                showLoading:false, 
                maxBlock: 0,
                noBlockMsg:'This is the first block',
                showBox:false,
                tableMinWidth:"",
                flBlockTransferNoData: false,
                isMobile: this.$store.state.isMobile,
            }
        },
        beforeMount() {
            Tools.scrollToTop();
            if (Tools.currentDeviceIsPersonComputer()) {
                this.transactionsDetailWrap = 'personal_computer_transactions_detail_wrap';
            } else {
                this.transactionsDetailWrap = 'mobile_transactions_detail_wrap';
            }
        },
        mounted() {
            this.getBlockInformation();
        },
        methods: {
            computeMinWidth(){
                if(this.$route.params.height){
                    this.tableMinWidth = 8.8;
                }
            },

            getBlockInformation() {
                this.showLoading  =true
            	Service.commonInterface({blocks:{head: this.$route.params.height,size:1,page:0}}, (result) => {
            		try {
                        this.showLoading = false
			            if (result.code === "0") {
				            this.getTransferList();
                            let data = result.data[0];
				            this.transactionsValue = data.txs;
				            this.heightValue = data.height;
				            this.timestampValue = `${Tools.tranTime(data.time)} ago (${Tools.formatDateYearAndMinutesAndSeconds(data.time)})`;
                            this.blockHashValue = data.block_hash;
                            this.proposerValue = data.proposer
                            this.maxBlock = result.total
			            } else {
				            this.validatorValue= '--';
				            this.inflationValue = '--';
				            this.heightValue = '';
				            this.timestampValue = '';
				            this.blockHashValue = '--';
				            this.transactionsValue = '--';
				            this.precommitValidatorsValue = '--';
				            this.votingPowerValue = '--';
			            }
		            }catch (e) {
			            console.error(e);
			            this.validatorValue= '--';
			            this.inflationValue = '--';
			            this.heightValue = '';
			            this.timestampValue = '';
			            this.blockHashValue = '--';
			            this.transactionsValue = '--';
			            this.precommitValidatorsValue = '--';
			            this.votingPowerValue = '--';
		            }
                });
            },
            getTransferList(){
            	Service.commonInterface({blockTxs:{head: this.$route.params.height,size:this.txSize,page:this.txPage}},(txList) => {
            		try {
                        if(txList.code === "0") {
                            this.items = [];
                            this.flBlockTransferNoData = txList.total == 0?true:false;
                            txList.data.forEach(item => {
                                if(item.height) {
                                    this.items.push({
                                        Tx_Hash: item.hash,
                                        Block: item.height,
                                        Amount: item.amount,
                                        Tx_Type: item.types,
                                        Tx_Fee: item.fee + ' HSN',
                                        Tx_Status: item.result?'Success':"Fail",
                                        Timestamp: Tools.formatDateYearAndMinutesAndSeconds(item.time)+','+Tools.tranTime(item.time),
                                        num: item.nums,
                                        listName: 'transfer',
                                    })
                                }
                            })
                            this.txTotal = txList.total;
                        }else {
                            this.flBlockTransferNoData = true;
                        }
		            }catch (e) {
			            console.error(e);
		            }
                });
            },
            closeBox() {
                this.showBox = false
            },
            skipNext(num) {
            	if(Number(this.$route.params.height) >= 1){
                    if (Number(this.$route.params.height) <= 1) {
                        if (num == 1) {
                            this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
                        }else {
                            this.showBox = true;
                            this.noBlockMsg = 'This is the first block';
                            setTimeout(()=>{
                                this.showBox = false
                            },3000);
                            return
                        }
                    } else if (Number(this.$route.params.height) >= this.maxBlock) {
                        if (num == -1) {
                            this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
                        }else {
                            this.showBox = true;
                            this.noBlockMsg = 'This is the last block';
                            setTimeout(()=>{
                                this.showBox = false
                            },3000);
                            return
                        }
                    } else {
                        this.$router.push(`/block/${Number(this.$route.params.height) + num}`)
                    }
	            }
            },
        }
    }
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
    .block_detail_container{
        padding: .1rem;
        .block_detail_content{
            .block_detail_title_content{
                height: 0.7rem;
                display: flex;
                align-items: center;
                max-width: 12rem;
                margin: 0 auto;
                .block_height_content{
                    max-width: 12rem;
                    width: 100%;
                    @include flex;
                    align-items: center;
                    .information_value{
                        flex: 1;
                        @include flex;
                        width: 4rem;
                        font-size: 0.22rem;
                        color: #22252a;
                        margin: 0 0.07rem;
                    }
                    .flag_item {
                        // display: inline-block;
                        height: 0.22rem;
                    }
                    .flag_item_left,.flag_item_right {
                        display: inline-block;
                        width: 0.2rem;
                        height: 0.23rem;
                        background: url('../assets/left.png') no-repeat 0 1px;
                        background-size:  0.2rem 0.2rem;
                        margin-right: 0.05rem;
                        cursor: pointer;
                    }
                    
                    .flag_item_right {
                        background: url('../assets/right.png') no-repeat 0 0;
                        background-size:  0.2rem 0.2rem;
                    }
                }
            }
        }
        .block_detail_information_container{
            padding:0 .1rem;
            max-width: 12rem;
            margin: 0 auto;
            border-radius: 0.1rem;
            box-shadow:0px 2px 6px rgba(0,0,0,0.16);
            
            .block_information_header {
                max-width: 12rem;
                width: 100%;
                height: 0.7rem;
                // margin-left:0.2rem;
                padding: 0 0.1rem;
                border-bottom: 0.01rem solid #0294D7;
                line-height: 0.7rem;
                font-size: 0.22rem;
            }
            .block_information_content{
                border-radius: 0.01rem;
                .current_block_information_content{
                    box-sizing: border-box;
                    padding: 0.2rem;
                    .block_information_item{
                        display: flex;
                        margin-bottom: 0.12rem;
                        span:nth-of-type(1){
                            color: rgba(34, 37, 42, 1);
                            font-size: 0.14rem;
                            line-height: 0.2rem;
                            width: 2.67rem;
                            max-width: 2.67rem;
                            min-width: 1.2rem;
                            display: inline-block;
                        }
                        span:nth-of-type(2){
                            flex: 1;
                            color: rgba(162, 162, 174, 1);
                            font-size: 0.14rem;
                            line-height: 0.2rem;
                            // overflow-x: auto;
                            word-break:break-all;
                            .common_link_style{
                                color: rgba(53, 152, 219, 1) !important;
                            }
                        }
                    }
                }
            }
        }
        .block_table_container{
            max-width: 12rem;
            margin: 0 auto;
            margin-bottom: 0.2rem;
            .block_result_container{
                box-shadow:0px 2px 6px rgba(0,0,0,0.16);
                margin-top: 0.2rem;
                .block_result_title{
                    height: 0.65rem;
                    display: flex;
                    align-items: center;
                    padding-left: 0.2rem;
                }
                .block_result_table_content{
                    overflow-x: auto;
                    -webkit-overflow-scrolling:touch;
                }
                .pagination{
                    display: flex;
                    justify-content: flex-end;
                }
                .validator_table_pagination {
                    max-width: 12rem;
                    width: 100%;
                    @include flex;
                    justify-content: center;
                    padding: .2rem 0;
                    .validator_table_pagination_content {
                        max-width: 5.4rem;
                        width: 100%;
                        @include flex;
                        justify-content: space-around;
                        align-items: center;
                    }
                }

            }
            .block_proposal_container{
                .block_proposal_title{
                    height: 0.65rem;
                    display: flex;
                    align-items: center;
                    padding-left: 0.2rem;
                }
                .pagination{
                    display: flex;
                    justify-content: flex-end;
                }
            }
            .block_validator_set_container{
                margin-bottom: 0.4rem;
                .block_validator_set_title{
                    height: 0.65rem;
                    display: flex;
                    align-items: center;
                    padding-left: 0.2rem;
                }
                .pagination{
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
        .blockBox {
            position: fixed;
            top:50%;
            left:50%;
            margin-left: -1.7rem;
            margin-top: -1.8rem;
            width: 3.3rem;
            height: 1.6rem;
            padding:0.1rem;
            background: white;
            border: 0.01rem solid rgba(51,51,51,1);
            border-radius: 0.1rem;
            z-index: 10;
            display: none;
            div {
                &:first-child {
                    width:0.2rem;
                    height:0.2rem;
                    margin-left: 2.9rem;
                    cursor:pointer;
                    text-align: center;
                }
                &:last-child {
                    line-height: 1rem;
                    text-align: center;
                }
            }
        }
        .showBox {
            display: block;
        }
    }
    .no_data_show{
        width: 100%;
        display: flex;
        justify-content: center;
        border-bottom:0.01rem solid #eee;
        font-size:0.14rem;
        max-width: 12rem;
        padding-top: 0.1rem;
        height:2rem;
        align-items: center;
    }
    @media screen and (max-width:910px) {
        .block_detail_container {
            .block_detail_content {
                .block_detail_title_content {
                    .block_height_content {
                        .flag_item {
                            // display: none;
                        }
                    }
                }
            }
            .block_detail_information_container{
                padding: 0 0.1rem;
                .block_information_content{
                    .current_block_information_content{
                    padding: 0.1rem !important;
                        .block_information_item{
                            span:nth-of-type(1){
                                width: 1.2rem;
                            }
                        }
                    }
                }
                
            }
        }
        .block_validator_set_title, .block_result_title, .block_proposal_title {
            padding-left: 0.1rem !important;
        }

    }
    @media screen and (max-width: 480px) {
        .block_detail_container {
            .block_detail_content {
                .block_detail_title_content {
                    .block_height_content {
                        .information_value {
                            font-size: .14rem;
                        }
                    }
                }
            }
            .block_table_container {
                .block_result_container {
                    .validator_table_pagination {
                        font-size: .12rem;
                    }
                }
            }
        }
    }
</style>

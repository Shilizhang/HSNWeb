<template>
    <div class="transactions_detail_wrap">

        <span class="validator_information_value" >
            <div style="color: #0294D7">&nbsp; ACCOUNT DETAILS</div>
        </span>
        <div class="validator_account">
            <div class="validator_account_header">
                <div class="validator_account_header_left">
                    <!-- <img src="" alt=""> -->
                    <canvas class="validator_account_header_left_qrcode" style="width: 0.6rem; height: 0.6rem; background-color: black; display: inline-block" id= "qrCode"></canvas>
                    <div class="validator_account_header_left_address">
                        <h5>Address</h5>
                        <div v-show="copySuccess" style="background: black; position: absolute; padding:0 .2rem; border-radius: .1rem;">复制成功</div>
                        <span class="validator_account_header_content" :data-clipboard-text="address" @click="copy($event)">{{address}}</span>
                    </div>
                </div>
                <div class="validator_account_header_right">
                    <h5 >Reward Address</h5>
                    <p class="validator_account_header_content">{{rewardAddress}}</p>
                </div>
            </div>
            <div class="validator_account_title">
                <div class="vadivdator_account_content">
                    <div id= "validator_account_content_echarts">
                    </div>
                    <ul class="validator_account_content_left">
                        <li v-for="item in echartsData" :key="item.color">
                            <div class="validator_account_content_left_name" style="flex:.4">
                                <span :style="{background: item.color}"></span>
                                <span>{{item.name}}</span>
                            </div>
                            <div style="flex:.3">
                                {{item.share}}
                            </div>
                            <div style="flex: .3; text-align: right;">
                                {{item.num}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="validator_account_title_atom">
                    <div>
                        <p>Total HSNs </p>
                        <p>{{amount}}</p>
                    </div>
                    <div>
                        <p>${{Number(price).toFixed(6)}} / HSN</p>
                        <p>${{Number(totalPrice).toFixed(6)}}</p>
                    </div>
                </div>
            </div>
        </div>
        <spin-component :showLoading="showLoading" />
        <div class= 'validator_table_container'>
            <div class="validator_table_container_delegations">
                <span style="font-size: 0.2rem;">Delegations</span>

                <m-validator-detail-table
                    :items="txTableList.delegators.items"
                    listName="delegators"
                ></m-validator-detail-table>

                <div class="validator_table_container_pagination"
                    style='margin-top:0.2rem' v-show="txTableList.delegators.items.length">
                    <span>Rows per page: 
                        <select v-model="deleSize">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
                    <b-pagination size="md" :total-rows="deleTotal" v-model="deleCurrentPage" :per-page="deleSize">
                    </b-pagination>
                    <span>Total: {{deleTotal}}</span>
                </div>
            </div>
            <div class="validator_table_container_declarations">
                <span style="font-size: 0.2rem;">Unbondings</span>
                <m-validator-detail-table
                    :items="txTableList.unbonding.items"
                    listName="unbonding"
                ></m-validator-detail-table>
                <div class="validator_table_container_pagination"
                    style='margin-top:0.2rem;'  v-show="txTableList.unbonding.items.length">
                    <span>Rows per page: 
                        <select v-model="unbondSize">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
                    <b-pagination size="md" :total-rows="unbondTotal" v-model="unbondCurrentPage" :per-page="unbondSize">
                    </b-pagination>
                    <span>Total: {{unbondTotal}}</span>
                </div>
            </div>
        </div>
        <div class="validator_table_container_proposed">
            <div >
                <p class="validator_table_container_proposed_title">
                    <span style="font-size: 0.2rem;">Transactions</span>
                </p>
            </div>
            <m-validator-detail-table
                    :items="txTableList.transactions.items"
                    listName="transactions"
                ></m-validator-detail-table>
            <div class="validator_table_container_pagination" v-show="txTableList.transactions.items.length">
                <span>Rows per page: 
                    <select v-model="txSize">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </span>
                <b-pagination size="md" :total-rows="txTotal" v-model="txCurrentPage" :per-page="txSize">
                </b-pagination>
                <span>Total: {{txTotal}}</span>
            </div>
        </div>
    </div> 
   
</template>

<script>
import Tools from '../util/Tools';
import BlocksListTable from './table/BlocksListTable';
import MValidatorDetailTable from "./table/MValidatorDetailTable";
import SpinComponent from './commonComponents/SpinComponent';
import Service from "../service";
import echarts from 'echarts'
import Server from '../service';
import QRCode from 'qrcode'
import Clipboard from 'clipboard'; 
export default {
    watch: {
        currentPage (currentPage) {
            this.currentPage = currentPage;
            new Promise((resolve) => {
                this.tabTxList(this.currentTabIndex, this.currentTxTabName, currentPage, this.pageSize);
                resolve();
            }).then(() => {
                document.getElementById('router_wrap').scrollTop = 0;
            })

        },
        $route () {
            Tools.scrollToTop();
            this.type = this.$route.params.type;
            this.tabTxList(this.tabTxListIndex, this.txTabName, this.currentPage, this.pageSize);
            this.getAddressTxStatistics();
            this.getAddressInformation(this.$route.params.param);
            this.getTransactionsList(1, 10, this.$route.params.type);
            // this.getProfileInformation();
            this.getCurrentTenureInformation();
            this.getValidatorHistory('14days');
            this.getValidatorUptimeHistory('24hours');
        },
        "$store.state.isMobile"(newVal) {
            // this.isMobileFunc(newVal);
        },
        txCurrentPage(val) {
            this.txPage = val -1;
            this.getDelegatorTxs();
        },
        txSize() {
            this.getDelegatorTxs();
        },
        unbondCurrentPage(val) {
            this.unbondPage = val -1;
            this.getUnbonding();
        },
        unbondSize() {
            this.getUnbonding();
        },
        deleCurrentPage(val) {
            this.delePage = val-1;
            this.getDelegators();
        },
        deleSize() {
            this.getDelegators();
        }
    },
    data () {
        return {
            address: this.$route.params.param,
            rewardAddress:'',
            amount:'',
            totalPrice:'',
            price:'',
            availableVal:[],
            commissionVal:[],
            delegatedVal:[],
            rewardVal:[],
            unbondingVal:[],
            delePage:0,
            deleSize:5,
            deleTotal:0,
            deleCurrentPage:1,
            unbondPage:0,
            unbondSize:5,
            unbondTotal:0,
            unbondCurrentPage:1,
            txPage:0,
            txSize:5,
            txCurrentPage:1,
            txTotal:0,
            copySuccess: false,

            rateValue: '',
            devicesWidth: window.innerWidth,
            transactionsDetailWrap: 'personal_computer_transactions_detail',
            activeBtn: 0,
            currentPage: 1,
            pageSize: 20,
            addressTxList: "",
            firstPercent: '',
            secondPercent: '%',
            balanceValue: '',
            depositsValue: '',
            transactionsValue: '',
            nameValue: '',
            pubKeyValue: '',
            websiteValue: '',
            descriptionValue: '',
            commissionRateValue: '',
            announcementValue: '',
            bondHeightValue: '',
            votingPowerValue: '',
            uptimeValue: '',
            precommitedBlocksValue: '',
            returnsValue: '',
            operatorValue: '',
            items: [],
            itemsPre: [],
            type: this.$route.params.type,
            totalBlocks: 0,
            totalFee: 0,
            TransactionsShowNoData: false,
            PrecommitBlocksshowNoData: false,
            transactionsCount: 0,
            flValidator: false,
            showNoData: false,
            showLoading: false,
            informationValidatorsLine: {},
            informationUptimeLine: {},
            transactionsTitle: "",
            count: 0,
            txTabName: "Transfers",
            tabTxListIndex: 0,
            currentTabIndex: "",
            currentTxTabName: "",
            identity: "",
            withdrawAddress: "",
            flShowValidatorJailed: false,
            flShowValidatorCandidate: false,
            flActiveValidator: true,
            flShowProfileLogo: false,
            validatorStatusColor: "#3598db",
            tabVotingPower: [
                {
                    "title": "14days",
                    "active": true
                },
                {
                    "title": "30days",
                    "active": false
                },
                {
                    "title": "60days",
                    "active": false
                }
            ],
            tabUptime: [
                {
                    "title": "24hours",
                    "active": true
                },
                {
                    "title": "14days",
                    "active": false
                },
                {
                    "title": "30days",
                    "active": false
                }
            ],
            txTab: [
                {
                    "txTabName": "Transfers",
                    "active": true,
                    txTotal: "",
                },
                {
                    "txTabName": "Stakes",
                    "active": false,
                    txTotal: "",

                },
                {
                    "txTabName": "Declarations",
                    "active": false,
                    txTotal: "",
                },
                {
                    "txTabName": "Governance",
                    "active": false,
                    txTotal: ""
                }
            ],
            echartsData: [],
            txTableList: {
                delegators: {
                    items: [],
                    currentPage: 1,
                    total: 0
                },
                unbonding: {
                    items: [],
                    currentPage: 1,
                    total: 0
                },
                transactions: {
                    items: [],
                    currentPage: 1,
                    total: 0
                }
            },
        }
    },
    components: {
        BlocksListTable,
        SpinComponent,
        MValidatorDetailTable
    },
    beforeMount () {
        // this.isMobileFunc(this.$store.state.isMobile);
    },
    mounted () {
        Tools.scrollToTop();
        this.getAccountInfo();
        this.getDelegatorAllKindsReward();
        this.getDelegators();
        this.getUnbonding();
        this.getDelegatorTxs();
        let code = document.getElementById("qrCode")
        QRCode.toCanvas(code, this.address, {width: 70, margin:3}, function (error) {})
    },
    methods: {
        copy(e) {  
            var clipboard = new Clipboard(e.target);
            clipboard.on('success', e => {
                this.copySuccess = true;
                setTimeout(()=>{
                    this.copySuccess = false;
                },3000)
                // 释放内存  
                clipboard.destroy()  
            })  
            clipboard.on('error', e => {  
                // 不支持复制  
                console.log('该浏览器不支持自动复制')  
                // 释放内存  
                clipboard.destroy()  
            })  
        },
        echartsinit() {
            let that = this;
            let myEcharts = echarts.init(document.getElementById("validator_account_content_echarts"))
            let option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)",
                    position: function (pos, params, dom, rect, size) {
                        var obj = {};
                        obj.left = pos[0];
                        obj.top = pos[1]-30
                        return obj;
                    }
                },
                color:['rgba(28,124,188,1)','rgba(28,124,188,.8)', 'rgba(28,124,188,.6)', 'rgba(28,124,188,.4)', 'rgba(28,124,188,.2)'],
                series: [{
                    type:'pie',
                    radius: '80%',
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show:false,
                        }
                    },
                    data:that.commissionVal?[
                        {value:that.availableVal[0],name:'Available'},
                        {value:that.delegatedVal[0],name:'Delegated'},
                        {value:that.unbondingVal[0],name:'Unbonding'},
                        {value:that.rewardVal[0],name:'Reward'},
                        {value:that.commissionVal[0],name:'Commission'},
                    ]:[
                        {value:that.availableVal[0],name:'Available'},
                        {value:that.delegatedVal[0],name:'Delegated'},
                        {value:that.unbondingVal[0],name:'Unbonding'},
                        {value:that.rewardVal[0],name:'Reward'},
                    ]
                }]
            }
            myEcharts.setOption(option)
        },
        getAccountInfo() {
            Service.commonInterface({accountInfo:{address:this.address}}, (data)=>{
                try{
                    let list = data.data;
                    this.rewardAddress = list.reward_address;
                    this.amount = list.amount;
                    this.totalPrice = list.total_price;
                    this.price = list.price
                    
                }catch(e) {

                }
            })
        },
        getDelegatorAllKindsReward() {
            Service.commonInterface({delegatorAllKindsReward:{address:this.address}}, (data)=>{
                try{
                    if(data.code === "0") {
                        let list = data.data;
                        this.availableVal = list.available
                        this.commissionVal = list.commission
                        this.delegatedVal = list.delegated
                        this.rewardVal = list.reward    
                        this.unbondingVal = list.unbonding
                        let key = Object.keys(list)
                        let i = 1
                        key.forEach(item =>{
                            if(item !== 'total_amount' && list[item]) {
                                this.echartsData.push({
                                    color: `rgba(28,124,188,${i})`,
                                    name: item.charAt(0).toUpperCase() + item.slice(1),
                                    share: (list[item][1]*100).toFixed(2) + '%',
                                    num: Number(list[item][0]).toFixed(6),
                                })

                            }
                                i -= .2

                        }) 
                        this.echartsinit()
                    }
                }catch(e) {

                }
            })
        },
        getDelegators() {
            this.showLoading = true;
            Service.commonInterface({
                delegators:{
                    address:this.address,
                    page:this.delePage,
                    size:this.deleSize,
                }
            },(data) =>{
                try{
                    this.showLoading = false;
                    let list = data.data;
                    this.txTableList.delegators.items=[];
                    list.result.forEach(item => {
                        this.txTableList.delegators.items.push({
                            validator:item.name,
                            reward: Number(item.reward).toFixed(6) + ' HSN',
                            amount: Number(item.balance.amount).toFixed(6) + " HSN",
                            address: item.validator_address,
                        })
                    })
                    this.txTableList.delegators.total = this.deleTotal = data.total
                }catch(e) {
                }
            })
        },
        getUnbonding() {
            this.showLoading = true;
            Service.commonInterface({
                unbonding:{
                    address: this.$route.params.param,
                    page:this.unbondPage,
                    size:this.unbondSize,
                }
            }, (data)=>{
                try{
                    this.showLoading = false;
                    if(data.code === "0") {
                        let list = data.data;
                        this.txTableList.unbonding.items = [];
                        list.result.forEach(item=>{
                            let time = item.entries[0].completion_time
                            this.txTableList.unbonding.items.push({
                                Block: item.entries[0].creation_height,
                                validator: item.name,
                                time: Tools.formatDateYearAndMinutesAndSeconds(time)+','+this.tranTime(time),
                                amount:item.entries[0].balance + " HSN",
                                address: item.validator_address
                            })
                        })
                        this.txTableList.unbonding.total= this.unbondTotal = data.total
                    }
                }catch(e) {
                }
            })
        },
        getDelegatorTxs() {
            this.showLoading = true;
            Service.commonInterface({delegatorTxs:{address:this.address,page:this.txPage,size:this.txSize}}, (data)=>{
                try{
                    this.showLoading = false;
                    if(data.code === "0") {
                        this.txTableList.transactions.items = [];
                        let list = data.data;
                        list.forEach(item => {
                            if(item.height) {
                                this.txTableList.transactions.items.push({
                                    Block: item.height,
                                    Tx_Hash: item.hash,
                                    type: item.types,
                                    result: item.result,
                                    amount: item.amount,
                                    fee: item.fee,
                                    Timestamp:Tools.formatDateYearAndMinutesAndSeconds(item.time)+','+Tools.tranTime(item.time),
                                })
                            }
                        })
                        this.txTableList.transactions.tota = this.txTotal = data.total
                    }
                }catch(e){
                }
            })
        },
        //计算unbonding的时间距离目前时间的间隔
        tranTime(time) {
            let diffTime = Number(new Date(time).getTime()/1000 - (new Date().getTime())/1000);
            let diffY = new Date(time).getFullYear() - new Date().getFullYear();
            let diffM = new Date(time).getMonth() - new Date().getMonth();
            let diffD = new Date(time).getDate() - new Date().getDate();

            if(diffTime < 60) {
                return Math.floor(diffTime) + 's'
            }else if(diffTime >= 60 && diffTime < 3600) {
                return Math.floor(diffTime/60) + 'm'
            }else if( diffTime >= 3600 && diffTime < 86400){
                return Math.floor(diffTime/3600)+ 'h';
            }else if(diffY == 0 && diffM == 0 && diffD > 0) {
                return diffD + 'd'
            }else if(diffY == 0 && diffM > 0 && diffD < 0) {
                return Math.floor(diffTime / 60 / 60 / 24 ) + 'd'
            }else if(diffY == 0 && diffM > 0 ) {
                return diffM + 'months'
            }else if(diffY > 0 && diffM < 0 ) {
                return diffM + 12 + 'months'
            }else if(diffY > 0 && diffM > 0) {
                return diffY + 'years'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/address_detail.scss";
</style>

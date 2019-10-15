<template>
    <div class="transactions_detail_wrap">
        <span class="validator_information_value" >
            <router-link to='/validators' >VALIDATOR &nbsp;</router-link>
            <div>&lt;</div>
            <div style="color: #0294D7">&nbsp; VALIDATOR DETAILS</div>
        </span>
        <div class="validator_info">
            <div class="validator_info_left">
                <div class = "validator_info_left_top">
                    <div class="validator_info_rank">{{rank}}</div>
                    <div class="validator_info_img">
                    </div>
                    <ul>
                        <li class="validator_info_name">
                            <div style="font-size: 0.22rem;">{{aka}}</div>
                            <div class="validator_info_name_active" style=" background: #57DC47; " v-if="!jailed">√ Active</div>
                            <div class="validator_info_name_active" style=" background: #E44242; " v-else>x jailed</div>
                        </li>
                        <li>
                            <div>Operator Address</div>
                            <div>{{address}}</div>
                        </li>
                        <li>
                            <div>Address</div>
                            <div class="validator_info_address">
                                <router-link :to="`/address/${operatorAddress}`">{{operatorAddress}}</router-link>    
                            </div>
                        </li>

                    </ul>
                </div>
                <ul class="validator_info_left_bottom">
                    <li>
                        <div>Website </div>
                        <div style="color:#003AD8; cursor: pointer;" @click="openWindow(webSite)">{{webSite}}</div>
                    </li>
                    <li>
                        <div>Commission </div>
                        <div>{{commission}}</div>
                    </li>
                    <li>
                        <div>Uptime </div>
                        <div>{{uptime}}%</div>
                    </li>
                    <li>
                        <div>Voting Power </div>
                        <div>{{votingPower}}</div>
                    </li>
                    <li>
                        <div>HSN Height </div>
                        <div class="validator_info_left_bottom_block">
                            <router-link :to="`/block/${hsnHeight}`"> {{hsnHeight}}</router-link>
                        </div>
                    </li>
                    <li>
                        <div>Details </div>
                        <div style="max-width: 5.4rem;">{{details}}</div>
                    </li>
                </ul>
            </div>
            <div class="validator_info_right">
                <div class="validator_info_deleg">
                    <p>Delegated</p>
                    <ul>
                        <li id= "validator_info_deleg_echarts">
                        </li>
                        <li class="validator_info_deleg_content">
                            <div class="validator_info_deleg_total">
                                Total: &nbsp; {{total}} &nbsp;  HSN
                            </div>
                            <div class="validator_info_deleg_msg">
                                <div>
                                    <span>Self</span>
                                    <span>{{selfB}}%</span>
                                    <span>{{self}}</span>
                                </div>
                                <div>
                                    <span>Others</span>
                                    <span>{{othersB}}%</span>
                                    <span>{{others}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="validator_info_block">
                    <div class="validator_info_block_name">Missed Blocks</div>
                    <ul>
                        <li v-for="(item,index) in block" :class="item.state == 1?'validator_info_block_content':'validator_info_block_null'" :key="item + index" @click="toBlockInfo(item.height)">
                            <div class="tooltip_span">
                                <i>{{item.height}}</i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class= 'validator_table_container'>
            <div class="validator_table_container_delegations">
                <div class="validator_table_container_delegations_title">
                    <span style="font-size: 0.2rem;">Delegators</span>
                    <span class="validator_table_container_delegations_title_right">
                        <img src="../assets/use-img.png" alt="">
                        <span>&nbsp;{{deleTotal}}(
                            <img src="../assets/up.png" alt="">    
                        {{deleAgo}} in 24h)</span>
                    </span>
                </div>
                <div style="min-height:3.5rem">
                    <m-validator-detail-table
                        :items="txTableList.delegations.items"
                        listName="delegations"
                    ></m-validator-detail-table>
                </div>

                <div class="validator_table_container_pagination"
                    style='margin-top:0.2rem;'  v-show="txTableList.delegations.items.length">
                    <span>Rows per page: 
                        <select v-model="deleSize">
                            <option value= '5'>5</option>
                            <option value= '10'>10</option>
                            <option value= "20">20</option>
                        </select>
                    
                    </span>
                    <b-pagination size="md" :total-rows="deleTotal" v-model="deleCurrentPage" :per-page="deleSize">
                    </b-pagination>
                    <span>Total: {{deleTotal}}</span>
                </div>
            </div>
            <div class="validator_table_container_declarations">
                <span style="font-size: 0.2rem;">Power Events</span>
                <div style="min-height:3.5rem">
                    <m-validator-detail-table
                        :items="txTableList.events.items"
                        listName="declarations"
                    ></m-validator-detail-table>
                </div>
                <div class="validator_table_container_pagination"
                    style='margin-top:0.2rem;' v-show="txTableList.events.items.length">
                    <span>Rows per page: 
                        <select v-model="eventSize" >
                            <option value= '5'>5</option>
                            <option value= '10'>10</option>
                            <option value= "20">20</option>
                        </select>
                    </span>
                    <b-pagination size="md" :total-rows="eventTotal" v-model="eventCurrentPage" :per-page="eventSize">
                    </b-pagination>
                    <span>Total: {{eventTotal}}</span>
                </div>
            </div>
        </div>
        <div class="validator_table_container_proposed">
            <div >
                <p class="validator_table_container_proposed_title">
                    <span style="font-size: 0.2rem;">Proposed Blocks</span>
                    <span class="validator_table_container_proposed_title_right">
                        <img src="../assets/proposed-block.png" alt="">
                        <span>Total :{{propoTotal}} blocks</span>
                    </span>
                </p>
            </div>
            <p style="padding: 0.12rem 0">A 4% reward bonus is given to the validator that proposes each block. This bonus is distributed to the chosen validator's delegators as well.</p>
            <m-validator-detail-table
                    :items="txTableList.proposedBlocks.items"
                    listName="proposedBlocks"
                ></m-validator-detail-table>
            <div class="validator_table_container_pagination" v-show="txTableList.proposedBlocks.items.length">
                <span>Rows per page: 
                    <select v-model="propoSize">
                            <option value= '5'>5</option>
                            <option value= '10'>10</option>
                            <option value= "20">20</option>
                        </select>
                </span>
                <b-pagination size="md" :total-rows="propoTotal" v-model="proposCurrentPage" :per-page="propoSize">
                </b-pagination>
                <span>Total: {{propoTotal}}</span>
            </div>
        </div>
        <spin-component :showLoading="showLoading" />
    </div>
</template>

<script>
import Tools from "../util/Tools";
import SpinComponent from "./commonComponents/SpinComponent";
import Service from "../service";
import MValidatorDetailTable from "./table/MValidatorDetailTable";
import MPagination from "./commonComponents/MPagination";
import axios from "../util/axios";
import echarts from 'echarts'
export default {

    data() {
        return {
            urlAddress: this.$route.params.param,
            jailed:null,
            aka:'',
            operatorAddress:'',
            address:'',
            webSite:'',
            commission:'',
            uptime:'',
            votingPower:'',
            hsnHeight:'',
            details:'',
            total: '',
            self:'',
            selfB:'',
            others:'',
            othersB:'',
            block: [],
            delePage:0,
            deleSize:5,
            deleTotal:'',
            deleCurrentPage:1,
            deleAgo:'',
            eventPage:0,
            eventSize:5,
            eventTotal:0,
            eventCurrentPage:1,
            propoHead:0,
            propoPage:0,
            propoSize:5,
            propoTotal:'',
            proposCurrentPage:1,
            showLoading: true,
            rank: null,


            transactionsDetailWrap: "personal_computer_transactions_detail",
            pageSize: 5,
            informationValidatorsLine: {},
            informationUptimeLine: {},
            flActiveValidator: true,
            keyBaseName: "",
            tabVotingPower: [
                {
                    title: "14days",
                    active: true
                },
                {
                    title: "30days",
                    active: false
                },
                {
                    title: "60days",
                    active: false
                }
            ],
            tabUptime: [
                {
                    title: "24hours",
                    active: true
                },
                {
                    title: "14days",
                    active: false
                },
                {
                    title: "30days",
                    active: false
                }
            ],
            validatorInfo: {
                "Voting Power": "",
                "Bond Height": "",
                "Bonded Tokens": "",
                "Unbonding Height": "",
                "Self Bonded": "",
                "Jailed Until": "",
                "Delegator Bonded": "",
                "Missed Blocks": "",
                Delegators: "",
                "Commission Rate": "",
                "Delegator Shares": "",
                "Max Rate": "",
                "Commission Rewards": "",
                "Max Change Rate": ""
            },
            validatorProfile: {
                "Operator Address": "",
                Website: "",
                "Owner Address": "",
                Identity: "",
                "Withdraw Address": "",
                Details: "",
                "Consensus Pubkey": ""
            },
            validatorProfileLinks: [
                "Website",
                "Identity",
                "Owner Address",
                "Withdraw Address"
            ],
            txTableList: {
                delegations: {
                    items: [],
                    currentPage: 1,
                    total: 0
                },
                events: {
                    items: [],
                    currentPage: 1,
                    total: 0
                },
                proposedBlocks: {
                    items: [],
                    currentPage: 1,
                    total: 0
                },
            },
            validatorName: "",
            validatorStatus: ""
        };
    },
    components: {
        SpinComponent,
        MValidatorDetailTable,
        MPagination
    },
    mounted() {
        Tools.scrollToTop();
        //初始化echarts ------------------  
        this.getValidatorBase();
        this.getValidatorDelegations();
        this.getValidatorPowerEvent();
        this.getValidatorProposedBlock();
        //-------------------
    },
    watch:{
        proposCurrentPage(val) {
            this.propoPage = val -1;
            this.getValidatorProposedBlock();
        },
        eventCurrentPage(val) {
            this.eventPage = val-1;
            this.getValidatorPowerEvent();
        },
        deleCurrentPage(val) {
            this.delePage = val -1;
            this.getValidatorDelegations();
        },
        deleSize(val) {
            this.deleSize = val;
            this.getValidatorDelegations();
        },
        eventSize(val) {
            this.eventSize = val;
            this.getValidatorPowerEvent();
        },
        propoSize(val) {
            this.propoSize = val;
            this.getValidatorProposedBlock();
        },
    },
    methods: {
        openWindow(val) {
            if(val.includes('http')) {
                window.open(val)
            }else {
                window.open('http://' + val)
            }
        },
        echartinit() {
            let that = this
            let myChart = echarts.init(document.getElementById("validator_info_deleg_echarts"));
            let option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)",
                    position:  function (pos, params, dom, rect, size) {
                        var obj = {};
                        obj.left = pos[0];
                        obj.top = pos[1]-30
                        return obj;
                    }
                },
                color:['rgba(28,124,188,1)','rgba(28,124,188,.8)'],
                series: [{
                    type:'pie',
                    radius: '80%',
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show:false,
                        }
                    },
                    data:[
                        {value:that.self,name:'self'},
                        {value:that.others,name:'others'},
                    ]
                }]
            };
            myChart.setOption(option)
        },
        getValidatorBase() {
            Service.commonInterface({validatorBase:{address:this.urlAddress}}, (data)=>{
                
                try{
                    if(data.data) {
                        let list = data.data; 
                        this.jailed = list.jailed;
                        this.aka = list.aka;
                        this.operatorAddress = list.address;
                        this.address = list.validator;
                        this.webSite = list.web_site;
                        this.commission = (list.commission*100).toFixed(2) + '%';
                        this.uptime = list.uptime;
                        this.votingPower = `${(list.voting_power.percent*100).toFixed(2)}% (${list.voting_power.amount} HSN)`
                        this.hsnHeight = list.hsn_height;
                        this.details = list.details;
                        this.total = list.total_token;
                        this.self = list.self_token;
                        this.others = list.others_token;
                        this.selfB = (list.self_token / list.total_token * 100).toFixed(2)
                        this.othersB = (list.others_token / list.total_token * 100).toFixed(2)
                        this.block = list.missed_block_list;
                        this.rank = list.rank;
                        this.echartinit();

                    }
                }catch(e){}
            })
        },
        getValidatorDelegations() {
            Service.commonInterface({validatorDelegations:{address:this.urlAddress,page:this.delePage,size:this.deleSize}}, (data)=>{
                try {
                    if(data.code === "0") {
                        this.txTableList.delegations.items = [];
                        let list = data.data;
                        this.deleTotal = list.total_delegation;
                        this.deleAgo = list.one_day_ago_delegations;
                        list.delegations.forEach(item => {
                            this.txTableList.delegations.items.push({
                                address: item.address,
                                amount: item.amount + 'HSN',
                                share: (item.share*100).toFixed(2) + '%'
                            })
                        })
                    }
                }catch(e) {}
            })
        },
        getValidatorPowerEvent() {
            Service.commonInterface({validatorPowerEvent:{address:this.urlAddress,page:this.eventPage,size:this.eventSize}},(data)=>{
                try{
                    if(data.code === '0') {
                        this.txTableList.events.items = []
                        let list = data.data
                        list.forEach(item =>{
                            this.txTableList.events.items.push({
                                Tx_Hash: item.hash,
                                block: item.height,
                                Amount: item.amount,
                                Timestamp: Tools.formatDateYearAndMinutesAndSeconds(item.time)+','+Tools.tranTime(item.time),
                                sign: item.sign
                            })
                        })
                        this.eventTotal = data.total
                    }
                }catch(e) {

                }
            })
        },
        getValidatorProposedBlock() {
            Service.commonInterface({validatorProposedBlock:{address:this.urlAddress,head:this.propoHead,page:this.propoPage,size:this.propoSize}}, (data)=>{
                try {
                    if(data.code === "0") {
                        this.showLoading =  false
                        this.txTableList.proposedBlocks.items = [];
                        data.data.forEach(item => {
                            this.txTableList.proposedBlocks.items.push({
                                blockHash: item.block_hash,
                                Block:item.height,
                                txs: item.txs,
                                Timestamp:  Tools.formatDateYearAndMinutesAndSeconds(item.time)+','+Tools.tranTime(item.time)
                            })
                        })
                        this.propoTotal = data.total;
                    }
                }catch(e) {

                }
            })
        },
        toBlockInfo(val) {
            this.$router.push('/block/'+ val)
        },
    }
};
</script>
<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/address_detail.scss";
</style>

<style lang="scss" scoped>
.validator_table_container {
    display: flex;
    flex-direction: column;
    .blocks_list_table_container + div {
        align-self: flex-end;
        margin-top: 0.2rem;
    }
}
.transactions_detail_wrap {
    
    & > div:nth-last-of-type(1) {
        margin-bottom: 0.4rem;
    }
}
.status_btn {
    height: 0.2rem;
    padding: 0 0.14rem;
    font-size: 12px;
    line-height: 0.2rem;
    border-radius: 0.1rem;
    color: #ffffff;
    background-color: #3598db;
}
.validator_detail_information_wrap {
    margin-top: 0.2rem;
    border: 1px solid #d7d9e0;
    border-radius: 1px;
    padding: 0.2rem 0.2rem 0.06rem;
    display: flex;
    flex-wrap: wrap;
    & > div {
        width: 50%;
        .information_props_wrap {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 12px;
            flex: 0 0 50%;
            display: flex;
            justify-content: space-between;
            .information_props {
                color: #22252a;
            }
            .information_value {
                color: #a2a2ae;
                width: calc(100% - 1.7rem);
                margin-right: 0.2rem;
                word-break: break-all;
                word-wrap: break-word;
            }
            .skip_route {
                a,
                span {
                    cursor: pointer;
                    color: #3598db !important;
                }
            }
        }
    }
}
.validator_information_content_title {
    height: 0.2rem;
    line-height: 0.2rem;
    color: #22252a;
    font-size: 18px;
    margin-top: 0.3rem;
    padding-left: 0.2rem;
}
.line_container_wrap {
    padding-bottom: 0 !important;
}
.delegations_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .validator_information_content_title {
        margin-bottom: 0.2rem !important;
    }
    & > div {
        flex: 1;
        display: flex;
        flex-direction: column;
        .delegations_table_container + div {
            float: right;
            align-self: flex-end;
            margin-top: 0.2rem;
        }
    }
    & > div:nth-child(2n) {
        margin-left: 20px;
    }
}
.delegations_two_container {
    display: block;
    white-space: nowrap;
    & > div {
        display: inline-block;
        width: calc(50% - 0.1rem);
        vertical-align: top;
    }
}
.line_tab_content_new {
    width: 180px;
    height: 0.3rem;
    display: flex;
    font-size: 12px;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
    div {
        width: 60px;
        box-sizing: border-box;
        border: 1px solid rgba(215, 217, 224, 1);
        color: #22252a;
        &:nth-of-type(1) {
            border-right-width: 0;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
        }

        &:nth-of-type(3) {
            border-left-width: 0;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
        }
    }
    .active {
        background-color: #3598db;
        border-color: #3598db;
        color: #ffffff;
    }
}
.mobile_transactions_detail_wrap {
    .validator_information_content_title {
        padding-left: 0.1rem;
    }
    .title {
        padding-left: 0.1rem;
    }
    .validator_detail_information_wrap {
        padding: 0.1rem;
        & > div {
            flex: 0 0 100%;
        }
        .information_props_wrap {
            margin-bottom: 0;
            flex-wrap: wrap;
            .information_props {
                width: 100%;
            }
            .information_value {
                width: 100%;
            }
        }
    }
    & > .second_table_container:nth-child(2n) {
        margin-left: 0px;
    }
    .delegations_container {
        flex-flow: column;
        & > div {
            width: 100%;
        }
        .delegations_table_container {
            width: 100%;
            overflow-x: auto;
        }
        .second_table_container {
            margin-left: 0;
        }
    }
    .information_value {
        margin-right: 0 !important;
    }
}
.personal_computer_transactions_detail_wrap {
    .delegations_container {
        overflow: hidden;
        .delegations_table_container {
            .validator_detail_table {
                overflow-x: auto;
            }
        }
    }
}
@media screen and (min-width: 1280px) {
    .personal_computer_transactions_detail_wrap {
        .delegations_container {
            overflow: visible !important;
            .delegations_table_container {
                .validator_detail_table {
                    overflow: visible !important;
                }
            }
        }
    }
}
</style>

<template>
    <div class="transactions_detail_wrap">
        <spin-component :showLoading="showLoading"></spin-component>
        <div :class="transactionsDetailWrap">
            <div class="transaction_information_nav">
                <router-link to='/txs' >TRANSACTIONS &nbsp;</router-link>
                <div>&lt;</div>
                <div style="color: #0294D7">&nbsp; TRANSACTION DETAILS</div>
            </div>
            <div class="transactions_detail_information_wrap" ref="valueInformation">
                <div style="margin-bottom: 0.2rem;">
                    <p class="transaction_information_content_title" >Information</p>
                </div>
                <div style="margin-bottom: .1rem; display: inline-block; padding: 0 0.2rem; background: #FF5E5E; border-radius:  0.2rem; color: white; " v-if="status === 'Fail'">
                    {{message}}
                </div>
                <div class="information_props_wrap">
                    <span class="information_props">TxHash :</span>
                    <span class="information_value">{{hashValue}}</span>
                </div>
                 <div class="information_props_wrap">
                    <span class="information_props">Status :</span>
                    <span class="information_value information_value_fixed">
                        <span class="success_status" v-show="status === 'Success'">
                            <img src="../assets/result-success.png" alt="">
                            {{status}}
                        </span>
                        <span class='fail_status' v-show="status === 'Fail'">
                            <img src="../assets/result-fail.png" alt="">
                            {{status}}
                        </span>
                        <!-- <div class="info_icon_div question_icon_div" v-if="status === 'Fail' && failInfo" v-table-tooltip="{show: true, container: $refs.valueInformation}">
                            <div class="tooltip_span">
                                <div>{{failInfo}}</div>
                                <i></i>
                            </div>
                        </div> -->
                    </span>
                </div>
                <div class="information_props_wrap">
                    <span class="information_props">Height :</span>
                    <span class="information_value link_active_style">
                        <router-link :to="`/block/${blockValue}`">{{blockValue}}</router-link>
                    </span>
                </div>
                <div  class="information_props_wrap">
                    <span class="information_props">Time :</span>
                    <span class="information_value">{{`${timeAgo} ago (${timestampValue}) `}}</span>
                </div>
                <div class="information_props_wrap">
                    <span class="information_props">Fee :</span>
                    <span class="information_value">{{actualTxFee}}</span>
                </div>
                <div class="information_props_wrap">
                    <span class="information_props">Gas ( used / wanted ):</span>
                    <span class="information_value information_value_fixed">
                        <span>{{gasUsedByTxn}}/ {{gasWanted}}</span>
                    </span>
                </div>
            </div>
            <div class="transactions_detail_information_wrap" ref="valueInformation" v-for="(item,key) in msgs" :key="key">
                <p style="font-size: .22rem; color: black" >Msgs</p>
                <div style="border: 0.01rem solid #0294D7; padding: 0.2rem 0.2rem 0.1rem 0.2rem; border-radius: 0.1rem;">
                    <div style="max-width: 11.2rem; height: .5rem; border-bottom: 1px solid rgba(2,148,215,1); margin-bottom: 0.1rem;">
                        <img v-show="item.name.includes('Get') || item.name.includes('EditAddress') || item.name.includes('Unjaild')" src="../assets/msgs.png" alt="">
                        <img v-show="item.name.includes('Send')" src="../assets/send.png" alt="">
                        <img v-show="item.name.includes('Vote')" src="../assets/vote.png" alt="">
                        <img v-show="item.name.includes('Create')" src="../assets/vote.png" alt="">
                        <img v-show="item.name.includes('elegate') || item.name.includes('EditValidator')" src="../assets/delegate.png" alt="">&nbsp;
                        <span>{{item.name}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.description">
                        <span class="information_props">Moniker</span>
                        <span class="information_value">{{item.value.description.moniker}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.description && item.value.description.website && item.value.description.website !== '[do-not-modify]' ">
                        <span class="information_props">Website</span>
                        <span class="information_value" @click="openWindow(item.value.description.website)">
                            <a >{{item.value.description.website }} </a>
                        </span>
                    </div>
                    
                    <div class="information_msgs" v-if="item.value.delegator_address">
                        <span class="information_props">Delegator</span>
                        <span class="information_value">
                            <router-link :to="`/address/${item.value.delegator_address}`">{{item.value.delegator_address}}</router-link> 
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.value.validator_address || item.value.address">
                        <span class="information_props">Validator</span>
                        <span class="information_value">
                            <router-link :to="`/validators/${item.value.validator_address || item.value.address}`">{{item.value.validator_address || item.value.address}}</router-link> 
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.value.Description && item.value.Description.website && item.value.Description.website !== '[do-not-modify]'">
                        <span class="information_props">Website</span>
                        <span class="information_value" @click="openWindow(item.value.Description.website)">
                            <a>{{item.value.Description.website }} </a>
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.rewardAmount">
                        <span class="information_props">Reward Amount</span>
                        <span class="information_value">{{item.rewardAmount}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.commissionAmount">
                        <span class="information_props">Commission</span>
                        <span class="information_value">{{item.commissionAmount}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.name === 'Delegate'">
                        <span class="information_props">Delegation Amount</span>
                        <span class="information_value">{{item.value.amount.amount}}{{item.value.amount.denom.toLocaleUpperCase()}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.from_address || item.value.validator_src_address">
                        <span class="information_props">From</span>
                        <span class="information_value">
                            <router-link :to="item.value.from_address?`/address/${item.value.from_address}`:`/validators/${item.value.validator_src_address}`">{{item.value.from_address || item.value.validator_src_address}}</router-link> 
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.value.to_address || item.value.validator_dst_address">
                        <span class="information_props">To</span>
                        <span class="information_value">
                            <router-link :to="item.value.to_address?`/address/${item.value.to_address}`:`/validators/${item.value.validator_dst_address}`">{{item.value.to_address || item.value.validator_dst_address}}</router-link>
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.value.from_address">
                        <span class="information_props">Amount</span>
                        <span class="information_value" v-for="(list,index) in item.value.amount" :key="list+index">{{list.denom === 'hsn'?list.amount + 'HSN':'--'}}
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.value.validator_src_address">
                        <span class="information_props">Redelegate Amount</span>
                        <span class="information_value">{{ item.value.amount.denom === 'hsn'? item.value.amount.amount + 'HSN':'--'}}
                        </span>
                    </div>
                    <div v-if="item.value.inputs">
                        <div class="information_msgs"  v-for="(list,index) in item.value.inputs" :key="list + index">
                            <span class="information_props">Inputs</span>
                            <span class="information_value">
                                <router-link v-for="(val,key) in list.coins" :to="`/address/${list.address}`"  :key="val+key">{{val.denom === "hsn"?list.address:''}} (<span style="color:#a2a2ae">{{val.denom === "hsn"?`${val.amount} HSN`:''}}</span>)</router-link> 
                            </span>
                        </div>
                    </div>
                    <div v-if="item.value.outputs">
                        <div class="information_msgs" v-for="(list,index) in item.value.outputs" :key="item + index">
                            <span class="information_props">Outputs</span>
                            <span class="information_value">
                                <router-link  v-for="(val,key) in list.coins" :to="`/address/${list.address}`" :key="val+key">{{val.denom === "hsn"?list.address:''}} (<span style="color:#a2a2ae">{{val.denom === "hsn"?`${val.amount} HSN`:''}}</span>)</router-link> 
                            </span>
                        </div>
                    </div>
                    <div class="information_msgs" v-if="item.name === 'Undelegate'">
                        <span class="information_props">Undelegation Amount</span>
                        <span class="information_value">{{item.value.amount.amount + 'HSN'}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.proposal_id">
                        <span class="information_props">Proposal Id</span>
                        <span class="information_value">
                            <router-link :to="`/address/${item.value.proposal_id}`">{{item.value.proposal_id}}</router-link> 
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.value.voter">
                        <span class="information_props">Voter</span>
                        <span class="information_value">
                            <router-link :to="`/address/${item.value.voter}`">{{item.value.voter}}</router-link> 
                        </span>
                    </div>
                    <div class="information_msgs" v-if="item.value.option">
                        <span class="information_props">Vote Option</span>
                        <span class="information_value">{{item.value.option}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.min_self_delegation">
                        <span class="information_props">Self Amount</span>
                        <span class="information_value">{{item.value.min_self_delegation}} HSN</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.value">
                        <span class="information_props">Other Amount</span>
                        <span class="information_value">{{item.value.value.amount}} HSN</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.description">
                        <span class="information_props">Details</span>
                        <span class="information_value">{{item.value.description.details}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.Description ">
                        <span class="information_props">Details</span>
                        <span class="information_value">{{item.value.Description.details}}</span>
                    </div>
                    <div class="information_msgs" v-if="Object.keys(item.value).includes('commission_rate')">
                        <span class="information_props">Commission Rate</span>
                        <span class="information_value">{{item.value.commission_rate?(Number(item.value.commission_rate)*100).toFixed(2) + '%':"0%"}}</span>
                    </div>
                    <div class="information_msgs" v-if="item.value.withdraw_address">
                        <span class="information_props">Reward Address</span>
                        <span class="information_value" >
                            <router-link :to="`/address/${item.value.withdraw_address}`">{{item.value.withdraw_address}}</router-link> 
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import Tools from '../util/Tools';
	import Service from "../service";
    import spinComponent from './commonComponents/SpinComponent'
	export default {
        components:{
            spinComponent
        },
		data() {
			return {
				devicesWidth: window.innerWidth,
				transactionsDetailWrap: 'personal_computer_transactions_detail_wrap',
				hashValue: '',
				blockValue: '',
				typeValue: '',
				fromValue: '',
				toValue: '',
                timestampValue: '',
                timeAgo:'',
				amountValue: '',
				actualTxFee: '',
				gasLimit:'',
                gasUsedByTxn:'',
                status: "",
                gasWanted: '',
                //msgs的数据
                msgs:[],
                msgsName:'',
                getRewardFalg:'',
                getCommissionFalg:'',
                delegateFalg:'',
                sendFlag:'',
                multiSendFlag:'',
                undelegateFlag:'',
                voteFlag:'',
                message:'',
                showLoading:true,
			}
		},
		watch:{
			$route(){
				this.getTransactionInfo();
				Tools.scrollToTop();
            },
		},
		mounted() {
            this.getTransactionInfo();
		},
		methods: {
            openWindow(val) {
                if(val.includes('http')) {
                    window.open(val)
                }else {
                    window.open('http://' + val)
                }
            },
			getTransactionInfo(){
				if(this.$route.query.txHash){
					Service.commonInterface({txDetail:{txHash:this.$route.query.txHash}}, (item) => {
						try {
							if(item.code === '0'){
                                let that = this;
                                let data = item.data
                                let msg = data.tx.value.msg
								this.hashValue = data.txhash;
                                this.status = data.logs ?data.logs[0].success ? 'Success' : 'Fail' :'Fail';
								this.blockValue = data.height;
								this.timestampValue = Tools.formatDateYearAndMinutesAndSeconds(data.timestamp)
                                this.timeAgo = Tools.tranTime(data.timestamp);
                                this.actualTxFee = data.tx.value.fee.amount.length?`${data.tx.value.fee.amount[0].amount} ${data.tx.value.fee.amount[0].denom.toUpperCase()}`: '0.00';
                                this.gasUsedByTxn = data.gas_used;
                                this.gasWanted = data.gas_wanted;
                                this.message = data.logs?data.logs[0].log && JSON.parse(data.logs[0].log).message:data.raw_log && JSON.parse(data.raw_log).message
                                msg.forEach(item => {
                                    let type = item.type;
                                    switch (type) {
                                        case 'cosmos-sdk/MsgWithdrawDelegationReward':
                                            item.name = 'GetReward';
                                            !data.events?'': data.events.forEach(list => {
                                                if(list.type === 'withdraw_rewards') {
                                                    list.attributes.forEach(val => {
                                                        if( val.key == 'amount') {
                                                            item.rewardAmount = val.value.toUpperCase() || '--'
                                                        }
                                                    })
                                                }
                                            })
                                            break;
                                        case 'cosmos-sdk/MsgWithdrawValidatorCommission':
                                            item.name = 'GetCommission';
                                            data.events.forEach(list => {
                                                if(list.type === 'withdraw_commission') {
                                                    list.attributes.forEach(val => {
                                                        if(val.value.includes('hsn')) {
                                                            item.commissionAmount = val.value.toUpperCase()
                                                        }
                                                    })
                                                }
                                            })
                                            break;
                                        case 'cosmos-sdk/MsgDelegate':
                                            item.name = 'Delegate';
                                            break;
                                        case 'cosmos-sdk/MsgSend':
                                            item.name = 'Send';
                                            break;
                                        case 'cosmos-sdk/MsgMultiSend':
                                            item.name = 'MultiSend';
                                            break;
                                        case 'cosmos-sdk/MsgUndelegate':
                                            item.name = 'Undelegate';
                                            break;
                                        case 'cosmos-sdk/MsgVote':
                                            item.name = 'Vote';
                                            break;
                                        case 'cosmos-sdk/MsgBeginRedelegate':
                                            item.name = 'Redelegate';
                                            break;
                                        case 'cosmos-sdk/MsgCreateValidator':
                                            item.name = 'Create Validator';
                                            item.commissionAmount = (Number(item.value.commission.rate)*100).toFixed(2) + "%"
                                            break;
                                        case 'cosmos-sdk/MsgEditValidator':
                                            item.name = 'EditValidator';
                                            break;
                                        case 'cosmos-sdk/MsgModifyWithdrawAddress':
                                            item.name = 'EditAddress';
                                            break;
                                        case 'cosmos-sdk/MsgUnjail':
                                            item.name = 'Unjaild';
                                            break;
                                    }
                                })
                                this.msgs = msg
                                this.showLoading = false
							}
						}catch (e) {
                            this.showLoading = false
                            console.error(e)
						}
                    })
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
    @import '../style/mixin.scss';
    .information_pre{
        color: #a2a2ae;
        white-space: pre-wrap;
    }
    .transactions_detail_wrap {
        @include flex;
        @include pcContainer;
        font-size:0.16rem;
        .transaction_information_nav {
            margin-top: .2rem;
            @include flex;
            font-size: 0.2rem;
        }
        .personal_computer_transactions_detail_wrap {
            max-width: 12rem;
            width: 100%;
            padding: .1rem;
            .transaction_information_content_title{
                height:0.5rem;
                padding-bottom: 0.2rem;
                border-bottom: 0.01rem solid #0294D7;
                font-size:0.22rem;
                color:#000000;
                @include fontWeight;
                font-family:ArialMT;
            }
            .transactions_detail_information_wrap{
                padding: 0.2rem ;
                margin-top: 0.3rem;
                margin-bottom: 0.4rem;
                box-shadow:0px 2px 6px rgba(0,0,0,0.16);
                border-radius: 0.1rem;
                .information_props_wrap{
                    @include flex;
                    line-height: 0.2rem;
                    margin-bottom: 0.12rem;
                        font-size: .14rem;

                    .information_props{
                        width:2.67rem;
                    }
                    .information_value{
                        color: #a2a2ae;
                        flex:1;
                        word-break: break-all;
                    }
                };
                .information_msgs {
                    line-height: 0.36rem;
                    @include flex;
                    justify-content: space-between;
                    font-size: .14rem;
                    .information_props{
                        display: inline-block;
                        width:2rem;
                    }
                    .information_value{
                        a{
                            word-break: break-all;
                            color: #3598db !important;
                            cursor: pointer;
                        }
                        color: #a2a2ae;
                        flex:1;
                    }
                }
            }
            .transactions_detail_title {
                height: 0.4rem;
                line-height: 0.4rem;
                font-size: 0.22rem;
                color: #000000;
                margin-right: 0.2rem;
                @include fontWeight;
            }
            .transactions_detail_wrap_hash_var {
                height: 0.4rem;
                line-height: 0.4rem;
                font-size: 0.22rem;
                color: #a2a2ae;
            }
        }

    }
    .link_active_style{
        a{
            color:#3598db !important;
        }
        color:#3598db !important;
        cursor:pointer;
    }
    .information_value_fixed {
        display: flex;
        align-items: center;
        & > span {
            margin-right: 0.06rem;
        }
        .fail_status {
            color: #fa8593;
            img {
                position: relative;
                bottom: .02rem;
            }
        }
        .success_status {
            img {
                position: relative;
                bottom: .02rem;
            }
        }
        .question_icon_div {
            background-image: url(../assets/question_icon.png) !important;
        }
        .info_icon_div {
            width: 0.14rem;
            height: 0.14rem;
            position: relative;
            background: url(../assets/info_icon.png) no-repeat top left / 14px 14px;
            cursor: pointer;
            &:hover {
                .tooltip_span {
                    display: block;
                    position: fixed;
                    opacity: 0;
                }
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
                    & > p {
                        white-space: nowrap;
                    }
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
        }
    }
    @media screen and (max-width: 870px) {
        .transactions_detail_wrap {
            .personal_computer_transactions_detail_wrap {
                .transactions_detail_information_wrap {
                    .information_props_wrap {
                        .information_props {
                            width: 1.2rem ;
                        }
                        .information_value {

                        }
                    }
                    .information_msgs {
                        .information_props {
                            width: 1.1rem ;
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width: 460px) {
        .transactions_detail_wrap {
            .personal_computer_transactions_detail_wrap {
                .transaction_information_nav {
                    font-size: .14rem;
                }
            }
        }
    }
</style>

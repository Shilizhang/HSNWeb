<template>
    <div class="validator_detail_table">
        <div v-show="!items.length" style="line-height: 3.5rem; text-align: center">
            <img src="../../assets/nodata.png" alt="">
        </div>
        <m-table :columns="fields" :data="items" :width="width" v-show="items.length">
            <template slot="Tx_Hash" slot-scope="{ row }">
                <div class="common_hover_parent" v-if="row.Tx_Hash">
                    <router-link
                        :to="`/tx?txHash=${row.Tx_Hash}`"
                        class="link_style common_font_style"
                    >{{formatTxHash(row.Tx_Hash)}}</router-link>
                </div>
            </template>
            <template slot="blockHash" slot-scope="{ row }">
                <div class="common_hover_parent" v-if="row.blockHash">
                    <router-link
                        :to="`/block/${row.Block}`"
                        class="link_style common_font_style"
                    >{{formatTxHash(row.blockHash)}}</router-link>
                </div>
            </template>
            <template slot="Block" slot-scope="{ row }">
                <span class="skip_route">
                    <router-link :to="`/block/${row.Block || row.block}`">{{row.Block || row.block}}</router-link>
                </span>
            </template>
            <template slot="From" slot-scope="{ row }">
                <span v-if="(/^[1-9]\d*$/).test(row.From)" class="skip_route">
                    <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{row.From}} Validators</router-link>
                </span>
                <div
                    class="name_address"
                    v-show="!(/^[0-9]\d*$/).test(row.From) && row.From && row.From !== '--'"
                >
                    <span
                        class="remove_default_style"
                        :class="row.From === $route.params.param?'no_skip':''"
                    >
                        <router-link
                            :to="addressRoute(row.From)"
                            class="link_style"
                        >{{formatMoniker(row.fromMoniker) || formatAddress(row.From)}}</router-link>
                    </span>
                    <span v-if="!row.fromMoniker" class="address">{{row.From}}</span>
                </div>
                <span class="no_skip" v-show="(/^[0]\d*$/).test(row.From) || row.From === '--'">--</span>
            </template>
            <template slot="OperatorAddr" slot-scope="{ row }">
                <span v-if="(/^[1-9]\d*$/).test(row.OperatorAddr)" class="skip_route">
                    <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{row.OperatorAddr}} Validators</router-link>
                </span>
                <div
                    class="name_address"
                    v-show="!(/^[0-9]\d*$/).test(row.OperatorAddr) && row.OperatorAddr && row.OperatorAddr !== '--'"
                >
                    <span
                        class="remove_default_style"
                        :class="row.OperatorAddr === $route.params.param?'no_skip':''"
                    >
                        <router-link
                            :to="addressRoute(row.OperatorAddr)"
                            class="link_style"
                        >{{formatAddress(row.OperatorAddr)}}</router-link>
                    </span>
                </div>
                <span
                    class="no_skip"
                    v-show="(/^[0]\d*$/).test(row.OperatorAddr) || row.OperatorAddr === '--'"
                >--</span>
            </template>
            <template slot="address" slot-scope="{ row }">
                <span v-if="(/^[1-9]\d*$/).test(row.address)" class="skip_route">
                    <router-link :to="`/tx?txHash=${row.address}`">{{row.address}} Validators</router-link>
                </span>
                <div
                    class="name_address"
                    v-show="!(/^[0-9]\d*$/).test(row.address) && row.address && row.address !== '--'"
                >
                    <span
                        class="remove_default_style"
                        :class="row.address === $route.params.param?'no_skip':''"
                    >
                        <router-link
                            :to="addressRoute(row.address)"
                            class="link_style"
                        >{{formatAddress(row.address)}}</router-link>
                    </span>
                </div>
                <span
                    class="no_skip"
                    v-show="(/^[0]\d*$/).test(row.address) || row.address === '--'"
                >--</span>
            </template>
            <template slot="proposer" slot-scope="{ row }">
                <div
                    class="name_address"
                    v-show="!(/^[0-9]\d*$/).test(row.proposer) && row.address && row.proposer !== '--'"
                >
                    <span
                        class="remove_default_style"
                        :class="row.proposer === $route.params.param?'no_skip':''"
                    >
                        <router-link
                            :to="addressRoute(row.proposer)"
                            class="link_style"
                        >{{formatMoniker(row.moniker) || formatAddress(row.proposer)}}</router-link>
                    </span>
                    <span v-if="!row.moniker" class="address">{{row.proposer}}</span>
                </div>
            </template>
            <template slot="To" slot-scope="{ row }">
                <span v-if="(/^[1-9]\d*$/).test(row.To)" class="skip_route">
                    <router-link :to="`/tx?txHash=${row.Tx_Hash}`">{{row.To}} Validators</router-link>
                </span>
                <div
                    class="name_address"
                    v-show="!(/^[0-9]\d*$/).test(row.To) && row.To && row.To !== '--'"
                >
                    <span
                        class="remove_default_style"
                        :class="row.To === $route.params.param?'no_skip':''"
                    >
                        <router-link
                            :to="addressRoute(row.To)"
                            class="link_style"
                        >{{formatMoniker(row.toMoniker) || formatAddress(row.To)}}</router-link>
                    </span>
                    <span v-if="!row.toMoniker" class="address">{{row.To}}</span>
                </div>
                <span class="no_skip" v-show="(/^[0]\d*$/).test(row.To) || row.To === '--'">--</span>
            </template>
            <template slot="Tx_Signer" slot-scope="{ row }">
                <span class="skip_route" style="display: flex" v-if="row.Tx_Signer">
                    <div class="name_address">
                        <span
                            class="remove_default_style"
                            :class="row.Tx_Signer === $route.params.param?'no_skip':''"
                        >
                            <router-link
                                :to="addressRoute(row.Tx_Signer)"
                                class="link_style justify"
                            >{{formatAddress(row.Tx_Signer)}}</router-link>
                        </span>
                    </div>
                </span>
            </template>
            <template slot="Moniker" slot-scope="{ row }">
                <span class="skip_route" style="display: flex" v-if="row.Moniker">
                    <div class="name_address">
                        <span
                            class="remove_default_style"
                            :class="row.OperatorAddr === $route.params.param?'no_skip':''"
                        >
                            <router-link
                                :to="addressRoute(row.OperatorAddr)"
                                class="link_style justify"
                            >{{formatMoniker(row.Moniker)}}</router-link>
                        </span>
                    </div>
                </span>
            </template>
            <template slot-scope="{ row }" slot="Proposal_ID">
                <router-link
                    :to="`/ProposalsDetail/${row.Proposal_ID}`"
                    class="link_style"
                >{{row.Proposal_ID}}</router-link>
            </template>
            <template slot-scope="{ row }" slot="proposal_id" >
                <router-link
                    :to="`/ProposalsDetail/${row.proposal_id}`"
                    class="link_style"
                >{{row.proposal_id}}</router-link>
            </template>
            <!-- <template slot-scope="{ row }" slot="txs" v-if="row.txs">
                <div>
                    {{row.txs}}
                </div>
            </template> -->
            <template slot-scope="{ row }" slot= "validator">
                <router-link :to="`/validators/${row.address}`">
                    {{row.validator}}
                </router-link>
            </template>
            <template slot-scope="{ row }" slot= "Timestamp">
                    <div style="line-height: 0.2rem">{{row.Timestamp.split(',')[0]}}</div>
                    <div style="line-height: 0.2rem">Last {{row.Timestamp.split(',')[1]}} ago</div>
            </template>
            <template slot-scope="{ row }" slot= "time">
                    <div style="line-height: 0.2rem">{{row.time.split(',')[0]}}</div>
                    <div style="line-height: 0.2rem">({{row.time.split(',')[1]}} remaining)</div>
            </template>
            <template slot-scope="{ row }" slot= "Amount">
                    <div :style="{color:row.sign == 0?'green':'red',}">
                        <img v-if="row.sign == 0" src="../../assets/up.png" alt="">
                        <img v-else src="../../assets/decline.png" alt="">
                        {{row.Amount}}
                    </div>
            </template>
            <template slot-scope= "{ row }" slot="type">
				<div class="common_hover_address_parent type" style="display: inline-block;height: 0.2rem;
					background: #0294D7;
					line-height: 0.2rem;
					color:white;
					padding: 0 0.1rem;
					border-radius: 0.1rem;">  
                    {{row.type}} 
                </div> <span v-if="row.num > 1"> + {{row.num-1}}</span>
			</template>
            <template slot-scope= "{ row }" slot="amount">
				<div v-if="row.num > 1" class="common_hover_address_parent">
                    <router-link :to="`/tx?txHash=${row.Tx_Hash}`" class="link_style">more</router-link>
                </div>
				<div v-else class="common_hover_address_parent">
					{{row.amount + ' HSN'}}
                </div>
			</template>
            <template slot-scope= "{ row }" slot="result">
				<div class="common_hover_address_parent">
                    <img v-if="row.result === 'Success'" src="../../assets/result-success.png" alt="">
					<img v-else src="../../assets/result-fail.png" alt="">
					{{row.result}}
                </div>
			</template>
        </m-table>
    </div>
</template>

<script>
import Tools from "../../util/Tools";
export default {
    name: "MValidatorDetailTable",
    props: {
        items: {
            type: Array,
            default: []
        },
        listName: {
            type: String,
            default: ""
        },
        width: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {
            fields: [],
            transfer: [
                {
                    title: "Tx_Hash",
                    slot: "Tx_Hash",
                    tooltip: true
                },
                {
                    title: "Block",
                    slot: "Block"
                },
                {
                    title: "From",
                    slot: "From"
                },
                {
                    title: "Amount",
                    ket: "Amount"
                },
                {
                    title: "To",
                    slot: "To"
                },
                {
                    title: "Tx_Type",
                    key: "Tx_Type"
                },
                {
                    title: "Tx_Fee",
                    key: "Tx_Fee"
                },
                {
                    title: "Tx_Signer",
                    slot: "Tx_Signer",
                    tooltip: true
                },
                {
                    title: "Tx_Status",
                    key: "Tx_Status"
                },
                {
                    title: "Timestamp",
                    key: "Timestamp"
                }
            ],
            stakes: [
                {
                    title: "Tx_Hash",
                    slot: "Tx_Hash",
                    tooltip: true
                },
                {
                    title: "Block",
                    slot: "Block"
                },
                {
                    title: "From",
                    slot: "From"
                },
                {
                    title: "Amount",
                    key: "Amount"
                },
                {
                    title: "To",
                    slot: "To"
                },
                {
                    title: "Tx_Type",
                    key: "Tx_Type"
                },
                {
                    title: "Tx_Fee",
                    key: "Tx_Fee"
                },
                {
                    title: "Tx_Signer",
                    slot: "Tx_Signer",
                    tooltip: true
                },
                {
                    title: "Tx_Status",
                    key: "Tx_Status"
                },
                {
                    title: "Timestamp",
                    key: "Timestamp"
                }
            ],
            declarations: [
                {
                    title: "Height",
                    slot: "Block",
                    className: 'text_left'
                },
                {
                    title: "TxHash",
                    slot: "Tx_Hash",
                    tooltip: true
                },
                // {
                //     title: "Moniker",
                //     slot: "Moniker"
                // },
                // {
                //     title: "Operator_Address",
                //     slot: "OperatorAddr",
                //     tooltip: true
                // },
                {
                    title: "Amount",
                    slot: "Amount"
                },
                // {
                //     title: "Tx_Type",
                //     key: "Tx_Type"
                // },
                // {
                //     title: "Tx_Fee",
                //     key: "Tx_Fee"
                // },
                // {
                //     title: "Tx_Signer",
                //     slot: "Tx_Signer",
                //     tooltip: true
                // },
                // {
                //     title: "Tx_Status",
                //     key: "Tx_Status"
                // },
                {
                    title: "Time",
                    slot: "Timestamp",
                    className: 'text_right'
                }
            ],
            gov: [
                {
                    title: "Tx_Hash",
                    slot: "Tx_Hash",
                    tooltip: true
                },
                {
                    title: "Block",
                    slot: "Block"
                },
                {
                    title: "Proposal_Type",
                    key: "Proposal_Type"
                },
                {
                    title: "Proposal_ID",
                    slot: "Proposal_ID"
                },
                {
                    title: "Proposal_Title",
                    key: "Proposal_Title"
                },
                {
                    title: "Amount",
                    key: "Amount"
                },
                {
                    title: "Tx_Type",
                    key: "Tx_Type"
                },
                {
                    title: "Tx_Fee",
                    slot: "Tx_Fee"
                },
                {
                    title: "Tx_Signer",
                    slot: "Tx_Signer",
                    tooltip: true
                },
                {
                    title: "Tx_Status",
                    key: "Tx_Status"
                },
                {
                    title: "Timestamp",
                    key: "Timestamp"
                }
            ],
            delegations: [
                {
                    title: "Delegator Address",
                    slot: "address",
                    tooltip: true,
                    width:244,
                    className: 'text_left'
                },
                {
                    title: "Amount",
                    key: "amount"
                },
                {
                    title: "Share",
                    key: "share",
                    className: 'text_right'
                },
            ],
            unbonding: [
                {
                    title: "Validator",
                    slot: "validator",
                    tooltip: true,
                    className: 'text_left',
                },
                {
                    title: "Block",
                    slot: "Block"
                },
                {
                    title: "Amount",
                    key: "amount"
                },
                {
                    title: "Completion Time",
                    slot: "time",
                    className: 'text_right'
                },
                
            ],
            redelegations: [
                {
                    title: "Address",
                    slot: "address",
                    tooltip: true
                },
                {
                    title: "Amount",
                    key: "amount"
                },
                {
                    title: "To",
                    slot: "To"
                },
                {
                    title: "Block",
                    slot: "Block"
                }
            ],
            depositedProposals: [
                {
                    title: "ID",
                    slot: "proposal_id"
                },
                {
                    title: "Proposer",
                    slot: "proposer"
                },
                {
                    title: "Deposit",
                    key: "depositedAmount"
                },
                {
                    title: "Submited",
                    key: "submited"
                },
                {
                    title: "Tx_Hash",
                    slot: "Tx_Hash",
                    tooltip: true
                }
            ],
            votedProposals: [
                {
                    title: "ID",
                    slot: "proposal_id",
                },
                {
                    title: "Title",
                    key: "title",
                    className: "text_overflow"
                },
                {
                    title: "Status",
                    key: "status"
                },
                {
                    title: "Voted",
                    key: "voted"
                },
                {
                    title: "Tx_Hash",
                    slot: "Tx_Hash",
                    tooltip: true
                }
            ],
            proposedBlocks: [
                {
                    title: "Height",
                    slot: "Block",
                    tooltip: true,
                    className: 'text_left'
                },
                {
                    title: "Block Hash",
                    slot: "blockHash",
                    tooltip: true
                },
                {
                    title: "Txs",
                    key: "txs"
                },
                {
                    title: "Time",
                    slot: "Timestamp",
                    className: 'text_right'
                },
            ],
            delegators: [
                {
                    title: 'Validator',
                    slot:'validator',
                    tooltip: true,
                    className: 'text_left',
                },
                {
                    title: 'Amount',
                    key:'amount',
                },
                {
                    title: 'Reward',
                    key:'reward',
                    className: 'text_right',
                },
            ],
            transactions: [
                {
                    title: 'Tx Hash',
                    slot:'Tx_Hash',
                    tooltip: true,
                    className: 'text_left',
                },
                {
                    title: 'Height',
                    slot:'Block',
                },
                {
                    title: 'Type',
                    slot:'type'
                },
                {
                    title: 'Result',
                    slot:'result'
                },
                {
                    title: 'Amount',
                    slot:'amount'
                },
                {
                    title: 'Fee',
                    key:'fee'
                },
                {
                    title: 'Time',
                    slot:'Timestamp',
                    className: 'text_right'
                },
                
            ]

        };
    },
    methods: {
        formatTxHash(TxHash) {
            if (TxHash) {
		        return `${TxHash.substring(0,12)}...${TxHash.substring(TxHash.length - 8)}`
            }
        },
        formatAddress(address) {
            return Tools.formatValidatorAddress(address);
        },
        formatMoniker(moniker) {
            if (!moniker) {
                return "";
            }
            return Tools.formatString(moniker, 15, "...");
        }
    },
    mounted() {
        this.fields = this[this.listName] || [];
    }
};
</script>

<style lang="scss">
.personal_computer_transactions_detail_wrap {
    .validator_detail_table { 
        .m-table-header {
            width: 100%;
            table.m_table {
                width: auto;
            }
        }
        table.m_table {
            min-width: 100%;
        }
    }
    .delegations_two_container {
        .m-table-header {
            width: 6.3rem;
        }
        table.m_table {
            min-width: 6.3rem;
        }
    }
}
.mobile_transactions_detail_wrap {
    .validator_detail_table {
        width: 12.8rem;
    }
}
</style>

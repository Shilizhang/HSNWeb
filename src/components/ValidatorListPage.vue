<template>
    <div class="blocks_list_page_wrap">
		<p class="vail_name">Vaildators</p>
		<m-dash-board></m-dash-board>
        <div :class="blocksListPageWrap">
            <div style=" -webkit-overflow-scrolling:touch; box-shadow:0px 2px 6px rgba(0,0,0,0.16); margin-top: 0.2rem;">
				<m-validator-list-table ref="mtable"
                                        :items="items"
                                        :minWidth="tableMinWidth"
										@getDataList="getDataList"
                                        :showNoData="showNoData"></m-validator-list-table>
                <div v-show="showNoData" class="no_data_show">
                    No Data
                </div>
            </div>
        </div>
        <spin-component :showLoading="showLoading"/>
    </div>
</template>

<script>
	import Tools from '../util/Tools';
	import Service from "../service"
    import Http from "../util/axios"
	import SpinComponent from './commonComponents/SpinComponent';
	import ValidatorListTable from "./table/ValidatorListTable";
    import MValidatorListTable from "./table/MValidatorListTable";
    import MTabs from "./commonComponents/MTabs";
	import MDashBoard from './commonComponents/MdashBoard'

	export default {
		components:{
			ValidatorListTable,
			SpinComponent,
            MValidatorListTable,
			MTabs,
			MDashBoard
		},
		watch: {
			$route() {
				this.currentPage = 1;
				this.showNoData = false;
				this.computeMinWidth();
			}
		},
		data() {
			return {
				devicesWidth: window.innerWidth,
				blocksListPageWrap: 'personal_computer_blocks_list_page',
				blocksValue: '',
				currentPage: 1,
				pageSize: 30,
				validatorPageSize: 100,
				defaultValidatorPageNumber:1,
				count: 0,
				fields: [],
				items: [],
				type: '1',
				showNoData:false,//是否显示列表的无数据
				showLoading:false,
				innerWidth : window.innerWidth,
				tableMinWidth: 0,
				listTitleName:"",
				
				
			}
		},
		beforeMount() {
			this.type = this.$route.params.type;
			if (window.innerWidth > 940) {
				this.blocksListPageWrap = 'personal_computer_blocks_list_page_wrap';
			} else {
				this.blocksListPageWrap = 'mobile_blocks_list_page_wrap';
			}
		},
		mounted() {
			this.getDataList('active');
			window.addEventListener('resize',this.onresize);
			this.computeMinWidth();
		},
		beforeDestroy() {
			window.removeEventListener('resize',this.onWindowResize);
		},
		methods: {
			
			onresize(){
				this.innerWidth = window.innerWidth;
				if(window.innerWidth > 940){
					this.blocksListPageWrap = 'personal_computer_blocks_list_page_wrap';
				} else {
					this.blocksListPageWrap = 'mobile_blocks_list_page_wrap';
				}
			},
			computeMinWidth(){
				this.tableMinWidth = 12;
			},
			getDataList(val) {
				this.showLoading = true;
				Service.commonInterface({vaildator:{type:val}},(item)=>{
					this.items = [];
					if(item.code === '0') {
						let data = item.data;
						if(data[val]) {
							data[val].forEach( (list,index) => {
								let obj = {
									rank: index + 1,
									moniker: list.aka,
									votingPower: `${list.voting_power.amount}r${(Number(list.voting_power.percent)*100).toFixed(2)}%`,
									CumulativeShare: (Number(list.cumulative)*100).toFixed(2) + '%',
									commission: (Number(list.commission)*100).toFixed(2) + '%',
									uptime: list.uptime + '%',
									address: list.validator_address,
								}
								this.items.push(obj)
							});
							this.$refs.mtable.itemsData = this.items
							this.showNoData = false
						}else {
							this.showNoData = true
						}
					}
				})
			},
		},
		
	}
</script>
<style lang="scss" scoped>
    @import '../style/mixin.scss';
    @import '../style/validator_list_page.scss';
</style>

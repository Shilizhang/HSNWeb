<!--头部页面-->
<template>
    <div :class="appHeaderVar"
         v-show="showHeader"
         id="header">
        <header class="app_header_person_computer"
                v-show="devicesShow === 1">
            <div class="header_top_container">
                <div class="header_top_content_wrap">
                    <div class="header_logo_content" @click="toHome">
                        <img src="../assets/logo.png">
                    </div>
                    <div class="header_menu_content">
                        <ul class="header_menu_list_content">
                            <li :class="activeClassName === '/home'?'nav_item_active':''"
                                @click="featureButtonClick('/home')">
                                Dashboard
                            </li>
                            <li :class="activeClassName === '/validators'?'nav_item_active':''"
                                @click="featureButtonClick('/validators')">
                                Validators
                            </li>
                            <li :class="activeClassName === '/blocks'?'nav_item_active':''"
                                @click="featureButtonClick('/blocks')">
                                Blocks
                            </li>
                            <li :class="activeClassName === '/txs'?'nav_item_active':''"
                                @click="featureButtonClick('/txs')">
                                Transactions
                            </li>
                        </ul>
                        <div class="header_network_content">
                            <div class="search_input_wrap">
                                <input type="text"
                                    class="search_input"
                                    placeholder="Search By Adderss,Txhash,Block Height..."
                                    v-model.trim="searchInputValue"
                                    @keyup.enter="onInputChange">
                                <span @click="getData(searchInputValue)">
                                    <img src="../assets/search_icon.png" />
                                </span>
                            </div>
                            <div class="network_list_content">
                                <div class="network_list_title_content">
                                    HSN Devnet-20191001
                                    <span class="bottom_arrow"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!--   mobile端, -->
        <div class="app_header_mobile"
             v-show="devicesShow === 0"
             ref="header_content">
            <div style="display: flex;flex-direction: row-reverse;justify-content: space-between;align-items: center;padding: 0 0.15rem;">
                <div class="feature_btn"
                     @click="showFeature">
                    <img src="../assets/menu.png">
                </div>
                <!-- <div style="width: 57%; height: 0.31rem; border: 0.01rem solid #707070; line-height: 0.31rem; text-align: center; color:#666; border-radius: 0.04rem; font-size: 0.12rem;"
                    @click="()=> this.showdownCode = true"> -->
                    <div style="width: 57%; height: 0.31rem; border: 0.01rem solid #707070; line-height: 0.31rem; text-align: center; color:#666; border-radius: 0.04rem; font-size: 0.12rem;"
                        @click="download">
                    App Wallet Download &nbsp; 
                    <!-- <img style="width: .2rem; height: .2rem; position: relative; bottom: .02rem;" src="../assets/head_dowload.png" alt=""> -->
                </div>
                <div class="image_wrap_mobile"
                     @click="toHome" >
                    <img src="../assets/logo_h5.png" />
                </div>
            </div>
            <div class="search_input_mobile">
                <div style="width:65%;display: flex;justify-content: center;">
                    <input type="text"
                           class="search_input"
                           v-model.trim="searchInputValue"
                           @keyup.enter="onInputChange"
                           placeholder="Search By Adderss,Txhash,,Block Height...">
                    <i class="search_icon"
                       @click="getData(searchInputValue)"></i>
                    <i class="clear_icon"
                       @click="clearSearchContent"
                       v-show="showClear"></i>
                </div>
                <div class="net_type">
                    <div class="network_list_title_content">
                        <div class="network_list_title_text">
                            HSN Devnet-20191001 &nbsp; 
                        </div>
                        <span class="bottom_arrow"></span>
                    </div>
                </div>
            </div>
            <div class="mobile_chain_id_content"
                 v-if="flShowChainId">
                <span class="mobile_chain_content">{{chainId}}</span>
            </div>
            <div  class="use_feature_mobile"
                    :style="{'height':innerHeight + 'px'}"
                    v-show="featureShow"
                    @click="hideFeature"
                    >
                <div class="use_feature_mobile_center" :style="{'height':innerHeight + 'px'}">
                    <span class="feature_btn_mobile ">
                        <img src="../assets/menu.png">
                    </span>
                    <span class="feature_btn_mobile "
                        :class="activeClassName === '/home'?'feature_nav':''"
                        @click="featureButtonClick('/home')">
                        Dashboard
                    </span>
                    <span class="feature_btn_mobile "
                        :class="activeClassName === '/validators'?'feature_nav':''"
                        @click="featureButtonClick('/validators')">
                        Validators
                    </span>
                    <span class="feature_btn_mobile "
                        :class="activeClassName === '/blocks'?'feature_nav':''"
                        @click="featureButtonClick('/blocks')">
                        Blocks
                    </span>
                    <span class="feature_btn_mobile "
                        :class="activeClassName === '/txs'?'feature_nav':''"
                        @click="featureButtonClick('/txs')">
                        Transactions
                    </span>
                </div>          
            </div>
            <div v-show="showdownCode" class="downloadCode" :style="{'height':innerHeight + 'px'}">
                <img src="../assets/close_code_h5.png" alt="" @click="()=> this.showdownCode = false">
                <img src="../assets/code_h5.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
	import Tools from '../util/Tools';
	import Service from "../service";
    import lang from "../lang/index"
    import explorerLogo from '../assets/logo.png'
	export default {
		name: 'app-header',
		watch: {
			$route () {
				this.searchInputValue = "";
				this.listenRouteForChangeActiveButton();
				this.showHeader = !(this.$route.query.flShow && this.$route.query.flShow === 'false' && !Tools.currentDeviceIsPersonComputer());
			},
			searchInputValue (searchInputValue) {
				if (searchInputValue) {
					this.showClear = true;
				} else {
					this.showClear = false;
				}
			},
		},
		data () {
			return {
                showdownCode:false,

				devicesWidth: window.innerWidth,
				devicesShow: 1,
				searchValue: '',
				appHeaderVar: 'person_computer_header_var',
				featureShow: false,
				transactionShow: false,
				validatorsShow: false,
				flShowGovernanceOption: false,
				flShowStatistics: false,
				searchInputValue: '',
				activeClassName: '/home',
				showHeader: !(this.$route.query.flShow && this.$route.query.flShow === 'false' && !Tools.currentDeviceIsPersonComputer()),
				flShowFaucet: false,
				showSubTransaction: false,
				showSubValidators: false,
				showClear: false,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
				flShowTransactionsSelect: false,
				flShowValidatorsSelect: false,
				flShowNetworkSelect: false,
				flShowGovernanceSelect: false,
				flShowTopListSelection: false,
				flShowUpOrDown: false,
				flShowNetwork: false,
				flShowHeaderNetwork: false,
				flShowChainId: false,
				flShowValidatorsUpOrDown: false,
				flShowNetworkUpOrDown: false,
				currentSelected: '',
				absoluteTop: '',
				lang: lang,
				chainId: '',
				upImg: require("../assets/caret-bottom.png"),
				downImg: require("../assets/caret-bottom.png"),
				netWorkArray: [],
				
				flShowSearchIpt: false,
                flShowLogo: false,
                dashImg:require('../assets/dash.png'),
                tranImg: require('../assets/tran.png'),
                blockImg: require('../assets/block.png'),
                vailImg: require('../assets/vail.png'),
                vailClickImg: require('../assets/vail-click.png'),
                tranClickImg: require('../assets/tran-click.png'),
                blockClickImg: require('../assets/block-click.png'),
                dashClickImg:require('../assets/dash-click.png'),
			}
		},
		beforeMount () {
			if (window.innerWidth > 940) {
				this.devicesShow = 1;
				this.appHeaderVar = 'person_computer_header_var';
			} else {
				this.devicesShow = 0;
				this.appHeaderVar = 'mobile_header_var';
			}
		},
		mounted () {
			document.getElementById('router_wrap').addEventListener('click', this.hideFeature);
			this.listenRouteForChangeActiveButton();
			window.addEventListener('resize', this.onresize);
			// this.getConfig();
		},
		beforeDestroy () {
			document.getElementById('router_wrap').removeEventListener('click', this.hideFeature);
			window.removeEventListener('resize', this.onWindowResize);
		},
		methods: {
            download() {
                window.location.href = 'https://invite.pmn.hsn.link/?ref=3531846&nsukey=7ozvnOQjcs%2F6QYgtczy%2BGvpkY46cwLrkEw8jcuQUuA%2Bi8pHMFq3iMFcPGj7IPOYfq3%2FV2ncSIU4l%2FYYSFWnMWuISGc%2FRKEzSmqTRrSgQOMOOCgiVu9HHtjLY0fKsh1KTgDtjSfowDT%2B8nYwLsSY3NlK%2B9Vhb3IXnhYeb%2F37%2BdAn0P9BtM0GkkdrVHQYuNueu82shJ%2BAax4lvw4Adjpiuaw%3D%3D'
            },
            toHome() {
                // window.location.href = 'https://www.hsn.link/'
                this.$router.push({path:'/home'})
            },
			transactionsSelect (flShowTransactionsSelect) {
				this.flShowValidatorsSelect = false;
				if (!flShowTransactionsSelect) {
					this.flShowTransactionsSelect = true;
					this.flShowUpOrDown = true
				} else {
					this.flShowUpOrDown = false;
					this.flShowTransactionsSelect = false
				}
			},
			netWorkSelect (flShowNetworkSelect) {
				this.flShowNetworkSelect = false;
				if (!flShowNetworkSelect) {
					this.flShowNetworkSelect = true;
					this.flShowNetworkUpOrDown = true
				} else {
					this.flShowNetworkSelect = false;
					this.flShowNetworkUpOrDown = false
				}
			},
			governanceSelect (flShowNetworkSelect) {
				this.flShowGovernanceSelect = false;
				if (!flShowNetworkSelect) {
					this.flShowGovernanceSelect = true;
					this.flShowNetworkUpOrDown = true
				} else {
					this.flShowGovernanceSelect = false;
					this.flShowNetworkUpOrDown = false
				}
			},
			topListSelect (flShowTopListSelection) {
				this.flShowTopListSelection = false;
				if (!flShowTopListSelection) {
					this.flShowTopListSelection = true;
					this.flShowNetworkUpOrDown = true
				} else {
					this.flShowTopListSelection = false;
					this.flShowNetworkUpOrDown = false
				}
			},
			hideFeature () {
				if (this.featureShow) {
					this.featureShow = false;
				}
			},
			onresize () {
                this.innerWidth = window.innerWidth;
                this.innerHeight = window.innerHeight;
				if (window.innerWidth > 940) {
					this.devicesShow = 1;
					this.appHeaderVar = 'person_computer_header_var';
				} else {
					this.devicesShow = 0;
                    this.appHeaderVar = 'mobile_header_var';
				}
			},
			showFeature () {
				this.featureShow = !this.featureShow;
			},
			featureButtonClick (path, isLogoClick) {
				this.showSubTransaction = false;
				this.showSubValidators = false;
				this.flShowGovernanceOption = false;
				this.flShowStatistics = false;
				this.listenRouteForChangeActiveButton();
				if (path !== 'network') {
					this.$router.push(path);
				}
            },
			getData () {
				if (Tools.removeAllSpace(this.searchInputValue) === '') {
					this.clearSearchContent();
					return
				} else {
					if (/^[A-F0-9]{64}$/.test(this.searchInputValue)) {
                        this.$router.push(`/tx?txHash=${this.searchInputValue}`);
					} else if (/^hsn([a-z0-9]){39}$/.test(this.searchInputValue)) {
                        this.$router.push('/address/'+this.searchInputValue)
                        
					} else if (/^hsnvaloper([a-z0-9]){39}$/.test(this.searchInputValue)) {
                        this.$router.push('/validators/'+this.searchInputValue)
                        
					} else if (/^[1-9][0-9]{0,6}$/.test(this.searchInputValue)) {
                        this.$router.push('/block/'+this.searchInputValue)
					} else {
                        alert("请输入正确信息")
					}
				}
			},
			toSearchResultPage () {
				this.$router.push(`/searchResult?${this.searchInputValue}`);
				this.searchInputValue = "";
			},
			onInputChange () {
				this.getData();
			},
			listenRouteForChangeActiveButton () {
				//刷新的时候路由不变，active按钮不变
				let path = window.location.href;
                if(path.includes('/tx')) {
                    this.activeClassName = '/txs';
                } else if (path.includes('/validators') || path.includes('/address')) {
					this.activeClassName = '/validators';
				} else if (path.includes('/block')) {
					this.activeClassName = '/blocks';
				} else if (path.includes('/home')) {
					this.activeClassName = '/home';
				} else if (path.includes('/faucet')) {
					this.activeClassName = '/faucet';
				} else if (path.includes('/parameters')) {
					this.activeClassName = '/governance';
				} else if (path.includes('/proposals')) {
					this.activeClassName = '/governance';
				} else if (path.includes('/statistics')) {
					this.activeClassName = '/statistics';
				} else {
					this.activeClassName = '';
				}
			},
			clearSearchContent () {
				this.searchInputValue = '';
			},
		},
		updated () {
			this.absoluteTop = `${this.$refs.header_content.clientHeight / 100}rem`
		}
	}
</script>
<style lang="scss">
    @import "../style/mixin.scss";
    .person_computer_header_var {
        position: fixed;
        z-index: 10001;
        background: rgba(255, 255, 255, 1);
        .app_header_person_computer {
            width: 100%;
            // background: #0f7bc4;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
            .header_top_container {
                max-width: 17.2rem;
                width: 100%;
                margin: 0 auto;
                padding: 0 0.2rem;
                .header_top_content_wrap {
                    display: flex;
                    align-items: center;
                    .header_logo_content {
                        width: 1.5rem;
                        cursor: pointer;
                        img {
                            width: 100%;
                        }
                    }
                    .header_menu_content {
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                        .header_menu_list_content {
                            flex: .35;
                            display: flex;
                            margin-left: 0.3rem;
                            justify-content: space-around;
                            li {
                                font-size: 0.14rem;
                                height: 0.8rem;
                                line-height: 0.8rem;
                                cursor: pointer;
                                img {
                                    width:  0.2rem;
                                    position: relative;
                                    bottom: 0.03rem ;
                                }
                            }
                            .nav_item_active {
                                color: #0294D7;
                                border-bottom: 3px solid #36AEFF;
                            }
                            .transaction_list_content {
                                z-index: 10000;
                                display: block;
                                padding: 0;
                                .transaction_content {
                                    box-sizing: border-box;
                                    padding: 0 0.23rem;
                                }
                                .bottom_arrow {
                                    display: inline-block;
                                    height: 0.8rem;
                                    width: 0.11rem;
                                    background: url("../assets/caret-bottom.png") no-repeat 50% 50%;
                                }
                                .transaction_list_item_content {
                                    z-index: 100;
                                    background: #0f7bc4;
                                    a {
                                        .transaction_list_item {
                                            height: 0.34rem;
                                            line-height: 0.34rem;
                                            text-align: left;
                                            color: #c9eafd;
                                            cursor: pointer;
                                            padding: 0 0.24rem;
                                        }
                                    }
                                }
                            }
                            .statics_list_content {
                                padding: 0;
                                display: block;
                                z-index: 10000;
                                .bottom_arrow {
                                    display: inline-block;
                                    height: 0.8rem;
                                    width: 0.11rem;
                                    background: url("../assets/caret-bottom.png") no-repeat 50% 50%;
                                }
                                .statics_content {
                                    box-sizing: border-box;
                                    padding: 0 0.23rem;
                                }
                                .statics_list_item_content {
                                    z-index: 100;
                                    a {
                                        .static_list_item {
                                            height: 0.34rem;
                                            line-height: 0.34rem;
                                            text-align: left;
                                            color: #c9eafd;
                                            cursor: pointer;
                                            padding: 0 0.24rem;
                                            background: #0f7bc4;
                                            &:hover {
                                                background: #086db1;
                                            }
                                        }
                                    }
                                }
                            }
                            .governance_list_content {
                                padding: 0;
                                display:  block;
                                z-index: 10000;
                                .bottom_arrow {
                                    display: inline-block;
                                    height: 0.8rem;
                                    width: 0.11rem;
                                    background: url("../assets/caret-bottom.png") no-repeat 50% 50%;
                                }
                                .governance_content {
                                    box-sizing: border-box;
                                    padding: 0 0.23rem;
                                }
                                .governance_list_item_content {
                                    z-index: 100;
                                    a {
                                        .governance_list_item {
                                            height: 0.34rem;
                                            line-height: 0.34rem;
                                            text-align: left;
                                            color: #c9eafd;
                                            cursor: pointer;
                                            padding: 0 0.25rem;
                                            background: #0f7bc4;
                                            &:hover {
                                                background: #086db1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        .header_network_content {
                            flex: .5;
                            width: 4.5rem;
                            padding-left: 0.2rem;
                            display: flex;
                            align-items: center;
                            .network_list_content {
                                flex: 3;
                                font-size: 0.14rem;
                                height: 0.35rem;
                                margin-right: 0.1rem;
                                line-height: 0.35rem;
                                z-index: 100;
                                border: 1px solid #0294D7;
                                border-radius:0.1rem;
                                cursor: pointer;
                                .network_list_title_content {
                                    position: relative;
                                    box-sizing: border-box;
                                    padding: 0 0.2rem;
                                    min-width: 1.8rem;
                                    font-size: 0.12rem;
                                    .bottom_arrow {
                                        position: absolute;
                                        right: 0rem;
                                        display: inline-block;
                                        height: 0.3rem;
                                        width: 0.35rem;
                                        background: url("../assets/caret-bottom.png") no-repeat 50%
                                        50%;
                                    }
                                }
                            }
                            //下面代码移上
                            .search_input_wrap {
                                flex: 7;
                                width: 3.5rem;
                                margin: 0 auto;
                                padding: 0rem 0.13rem ;
                                display: flex;
                                align-items: center;
                                font-size: 0.18rem;
                                input {
                                    width: 100%;
                                    text-indent: 0.22rem;
                                    // width: 4rem;
                                    height: 0.35rem;
                                    border-radius: 0.2rem 0 0 0.2rem;
                                    box-shadow: none;
                                    border: 1px solid #0294D7;
                                    border-right: none;
                                    background: none;
                                    font-size: 0.14rem;
                                }
                                span {
                                    width:0.5rem;
                                    height: 0.35rem;
                                    line-height: 0.35rem;
                                    border: 1px solid #0294D7;
                                    border-left: none;
                                    padding-left: 0.08rem;
                                    border-radius: 0 0.2rem 0.2rem 0;
                                    cursor: pointer;
                                    img {
                                        width: 0.15rem;
                                        height: 0.15rem; 
                                    }
                                }
                            }
                            .search_input_show {
                                width:0.48rem;
                                height: 0.48rem;
                                background: black;
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }
    .mobile_header_var {
        position: relative;
        z-index: 2;
    }
    .person_computer_header_var,
    .mobile_header_var {
        @include flex();
        @include pcContainer;
        .useFeature {
            width: 100%;
            height: 0.66rem;
            @include flex;
            flex-direction: column;
            align-items: center;
            .navButton {
                width: 100% !important;
                padding: 0 0.2rem;
                height: 0.66rem;
                @include pcCenter;
                @include flex;
                .common_item_style {
                    &:hover {
                        color: #ffffff;
                        background: #005a98;
                    }
                }
                .nav_item {
                    display: inline-block;
                    height: 0.65rem;
                    line-height: 0.66rem;
                    width: 1.6rem;
                    text-align: center;
                    font-size: 0.18rem;
                    cursor: pointer;
                    color: #c9eafd;
                    font-weight: 500 !important;
                    .bottom_arrow {
                        display: inline-block;
                        height: 0.11rem;
                        width: 0.11rem;
                        background: url("../assets/caret-bottom.png") no-repeat 0 0;
                        top: 0.27rem;
                        right: 0.1rem;
                    }
                }
                .sub_btn_wrap {
                    @include flex;
                    flex-direction: column;
                    z-index: 100;
                    padding: 0;
                    .sub_btn_item {
                        height: 0.36rem;
                        line-height: 0.36rem;
                        font-size: 0.14rem;
                        background: #005a98;
                        color: #c9eafd;
                        width: 1.6rem;
                        text-align: left;
                        padding-left: 0.2rem;
                        a {
                            width: 100%;
                            display: inline-block;
                            padding-left: 0.19rem;
                            color: #c9eafd !important;
                            &:hover {
                                color: #00f0ff !important;
                            }
                        }
                        &:hover {
                            color: #00f0ff;
                        }
                    }
                    .top_list_option {
                        padding-left: 0.38rem;
                    }
                    .validators_btn_item {
                        padding-left: 0.35rem;
                    }
                }
                .nav_item_active {
                    color: #ffffff;
                    background: #005a98;
                    
                }
                .btn-group,
                .btn-group-vertical {
                    vertical-align: baseline;
                }
            }
        }
        .app_header_mobile {
            width: 100%;
            padding: 0.15rem 0 0 0;
            @include flex();
            flex-direction: column;
            box-shadow: 0px 1px 4px rgba(0,0,0,0.16);
            position: relative;
            .feature_btn {
                width: 0.25rem;
                height: 0.25rem;
                top: 0.26rem;
                right: 0.1rem;
                img {
                    width: 100%;
                }
            }
            .image_wrap_mobile {
                @include flex;
                align-items: center;
                img {
                    width: 100%;
                    height: 100%;
                }
                .logo_title_wrap {
                    margin-left: 0.16rem;
                    @include flex;
                    flex-direction: column;
                    justify-content: center;
                    .logo_title_content {
                        height: 0.27rem;
                        line-height: 0.27rem;
                        span {
                            &:first-child {
                                font-size: 0.24rem;
                                color: #005a98;
                            }
                            &:last-child {
                                font-size: 0.24rem;
                                color: #3598db;
                            }
                        }
                    }
                    p {
                        font-size: 0.14rem;
                        span {
                            color: #aeaeb9;
                        }
                    }
                }
            }
            .search_input_mobile {
                margin: 0.1rem 0.15rem;
                @include flex();
                // flex-direction: column;
                align-items: center;
                justify-content: space-between;
                position: relative;
                input::-webkit-input-placeholder {
                    text-align: center;
                    font-size: 0.1rem;
                    color: #cccccc;
                }
                input {
                    box-shadow: none;
                    width: 100%;
                    @include borderRadius(0.06rem);
                    border: 0.01rem solid #86C5EF;
                    font-size: 0.14rem;
                    padding: 0 0.48rem 0 0.1rem;
                    height: 0.3rem;
                    &:focus {
                        border: 0.01rem solid #86C5EF;
                        outline: none;
                    }
                }
                .search_icon {
                    position: absolute;
                    top: 0.07rem;
                    right: 37%;
                    width: 0.15rem;
                    height: 0.15rem;
                    background: url("../assets/search.svg") no-repeat;
                    cursor: pointer;
                }
                .clear_icon {
                    position: absolute;
                    top: 0.08rem;
                    right: 0.32rem;
                    width: 0.15rem;
                    height: 0.15rem;
                    background: url("../assets/clear.png") no-repeat;
                    cursor: pointer;
                }
                .net_type {
                    width: 30%;
                    font-size: 0.1rem;
                    
                    .network_list_title_content {
                        display: flex; 
                        // justify-content: center; 
                        align-items: center;
                        padding-left:.05rem;
                        width: 100%;
                        height: 0.28rem;
                        border: .01rem solid #86C5EF;
                        border-radius: 0.05rem;
                        position: relative;
                        .network_list_title_text {
                            width: 80%;
                            white-space:nowrap;
                            overflow:hidden;
                            text-overflow:ellipsis;
                        }
                        .bottom_arrow {
                            position: absolute;
                            right: .1rem;
                            height: 0.18rem;
                            width: 0.11rem;
                            background: url("../assets/caret-bottom.png") no-repeat 50% 50%;
                        }
                    }
                }
            }
            .mobile_chain_id_content {
                height: 0.3rem;
                margin: 0 0.15rem;
                background: rgba(234, 248, 254, 1);
                display: flex;
                justify-content: flex-start;
                line-height: 0.3rem;
                font-size: 0.14rem;
                margin-bottom: 0.1rem;
                border-radius: 0.06rem;
                .mobile_chain_content {
                    padding-left: 0.1rem;
                }
            }
            .use_feature_mobile {
                z-index: 1010;
                width: 100%;
                position: fixed;
                background: rgba(0, 0, 0, .3);
                top:0;
                .use_feature_mobile_center {
                    z-index: 100;
                    padding-right: .2rem;
                    width: 33%;
                    min-width: 1.2rem;
                    max-width: 3rem;;
                    @include flex();
                    flex-direction: column;
                    align-content: flex-start;
                    position: absolute;
                    right: 0;
                    background: white;
    
                    .feature_btn_mobile {
                        height: 0.39rem;
                        line-height: 0.39rem;
                        padding-left: 0.15rem;
                        color: #333;
                        font-size: 0.14rem;
                        text-align: right;
                        a {
                            display: inline-block;
                            width: 100%;
                            color: #fff !important;
                        }
                    }
                    
                    .feature_arrow {
                        position: relative;
                        color: #c9eafd;
                        font-size: 0.14rem;
                        background: url("../assets/caret-bottom.png") no-repeat 97% 0.12rem,
                        // #3598db;
                    }
                    .feature_subNav {
                        padding-left: 0.3rem;
                    }
                    .feature_nav {
                        color: #1592E6;
                    }
                }
            }
        }
    }
    .chain_id {
        padding-right: 0.26rem;
        font-size: 0.16rem;
        color: #f2711c;
        @include fontWeight;
    }
           
    .downloadCode {
        width:100%;
        background: rgba(0, 0, 0, .2);
        position: fixed;
        top: 0;
        @include flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
            &:first-child {
                position: relative;
                top: .28rem;
                left: 1.38rem;
            }
        }
    }
    @media screen and (max-width: 1200px) {
        .person_computer_header_var {
            .app_header_person_computer {
                .header_top_container {
                    .header_top_content_wrap {
                        .header_menu_content {
                            .header_menu_list_content {
                                margin-left: 0.08rem;
                                li {
                                    padding: 0 0.05rem;
                                }
                                .nav_item_active {
                                    padding: 0 0.05rem;
                                }
                                .transaction_list_content {
                                    padding: 0;
                                    .transaction_content {
                                        padding: 0 0.08rem;
                                    }
                                    .transaction_list_item_content {
                                        a {
                                            .transaction_list_item {
                                                padding: 0 0.08rem;
                                            }
                                        }
                                    }
                                }
                                .statics_list_content {
                                    padding: 0;
                                    .statics_content {
                                        padding: 0 0.08rem;
                                    }
                                    .statics_list_item_content {
                                        a {
                                            .static_list_item {
                                                padding: 0 0.08rem;
                                            }
                                        }
                                    }
                                }
                                .governance_list_content {
                                    padding: 0;
                                    .governance_content {
                                        padding: 0 0.08rem;
                                    }
                                    .governance_list_item_content {
                                        a {
                                            .governance_list_item {
                                                padding: 0 0.08rem;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="home_wrap" >
        <div class="headerImg" v-if="pageClassName == 'personal_computer_home_wrap'">
            <img  src="../assets/home_top.png" alt="" />
            <div class="download_ios">
                <img class="download_ios_img" src="../assets/download_ios.png" alt="">
                <img class="download_ios_code" src="../assets/download-code.png" alt="">
            </div>
        </div>
        <div v-else class="headerImg">
            <img style="width: 100%;"  src="../assets/bander_h5.png" alt="" />
        </div>
        <div :class="pageClassName">
            <div class="information_preview">
                <ul class="current_net_status_list">
                    <li class="item_status">
                        <div class="item_status_left">
                            <div class="img_container">
                                <span class="item_name">Price</span>
                            </div>
                            <div class="current">
                                <div>
                                    <p id="current_echarts"></p>
                                    <span class="proposer_bottom">
                                        <img v-show="priceDiff >= 0" src="../assets/up.png" alt="">
                                        <img v-show="priceDiff < 0" src="../assets/decline.png" alt="">
                                        <span>{{priceDiff}}%(10min)</span>
                                    </span>
                                </div>
                                <p class="current_content " >
                                    <span class="proposer_top">
                                        $ {{price}}
                                    </span>
                                    
                                </p>
                            </div>
                        </div>
                        <div  class="item_status_left">
                            <div class="img_container">
                                <span class="item_name">Height</span>
                            </div>
                            <div class="current">
                                <p></p>
                                <p class="current_num">{{blockHeight}}</p>
                            </div>
                        </div>
                    </li>
                    <li class="item_status">
                        <div class="item_status_right">
                            <div class="img_container">
                                <span class="item_name">HSN</span>
                            </div>
                            <div class="current">
                                <div>
                                    <p id = "hsn_echarts"></p>
                                    <span class="proposer_bottom">
                                        <img v-show="hsnDiff >= 0" src="../assets/up.png" alt="">
                                        <img v-show="hsnDiff < 0" src="../assets/decline.png" alt="">
                                        <span>{{hsnDiff}}%(24h)</span>
                                    </span>
                                </div>
                                <p class="current_content current_three">
                                    <span class="proposer_top">
                                            {{pledgeTotal}}
                                    </span>
                                    <span class="proposer_num">
                                        {{pledgeHsn}} / {{totalHsn}}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div class="item_status_right">
                            <div class="img_container">
                                <span  class="item_name">Block Time</span>
                            </div>
                            <div class="current">
                                <p class="current_year"></p>
                                <p class="current_num">{{blockTime.toFixed(2)}} s</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div :class="module_item_wrap">
                <div class="home_module_item fixed_item_height">
                    <home-block-module :moduleName="'Blocks'" :information="blocksInformation"></home-block-module>
                </div>
                <div class="home_module_item fixed_item_height">
                    <home-block-module :moduleName="'Transactions'" :information="transactionInformation"></home-block-module>
                </div>
            </div>
            <spin-component :showLoading="showLoading"></spin-component>
        </div>
    </div>
</template>

<script>
    import Tools from '../util/Tools';
    import HomeBlockModule from "../components/HomeBlockModule";
    import Service from '../service/index';
    import echarts from 'echarts';
    import spinComponent from '../components/commonComponents/SpinComponent'
    import { log } from 'util';
    export default {
        name: 'app-header',
        components: { HomeBlockModule, spinComponent},
        data() {
            return {
                timer:null,
                echartsTimer:null,
                devicesWidth: window.innerWidth,
                pageClassName: 'personal_computer_home_wrap',
                module_item_wrap: 'module_item_wrap_computer',
                blocksInformation: [],
                transactionInformation: [],
                innerWidth : window.innerWidth,
                isMobile: false,
                priceEchartsData:[], 
                hsnEchartsData:[],
                blockTime:0,
                blockHeight:'',
                inflation:'',
                price:'',
                pledgeHsn:'',
                totalHsn:'',
                pledgeTotal:'',
                priceDiff:'',
                hsnDiff:'',
                showLoading:true,
                echartsMultiple:1.02,
                hsnEahartsDom:null,
                currentEahartsDom:null,
            }
        },

        beforeMount () {
            window.addEventListener('resize',this.onWindowResize);
        },
        mounted () {
            let that =this;
            this.hsnEahartsDom = document.querySelector("#hsn_echarts")
            this.currentEahartsDom = document.querySelector("#current_echarts")
            if (!this.$store.state.isMobile) {
                this.pageClassName = 'personal_computer_home_wrap';
                this.module_item_wrap = 'module_item_wrap_computer';
                if(document.getElementsByClassName('fixed_item_height').length > 0){
                    document.getElementsByClassName('fixed_item_height')[0].style.height = '4.5rem';
                    document.getElementsByClassName('fixed_item_height')[1].style.height = '4.5rem';
                }
            } else {
                this.pageClassName = 'mobile_home_wrap';
                this.module_item_wrap = 'module_item_wrap_mobile';
            }
            this.getPublic();
            this.getEcharts();
            this.getBlock();
            this.getTransactions();
            this.timer = setInterval(()=>{
                this.getBlock()
                this.getPublic();
                this.getTransactions()
            },6000)
            this.changeEcharts()
            this.echartsTimer = setInterval(()=>{
                this.getEcharts();
            },600000)
        },
        beforeDestroy () {
            window.removeEventListener('resize',this.onWindowResize);
            clearInterval(this.timer)
            clearInterval(this.echartsTimer)
        },
        watch: {
          '$store.state.isMobile'(newVal, oldVal) {
            this.onresize(newVal);
          }
        },
        methods: {
            
            onresize (isMobile) {
                this.innerWidth = window.innerWidth;
                if(!isMobile){
                    this.pageClassName = 'personal_computer_home_wrap';
                    this.module_item_wrap = 'module_item_wrap_computer';
                    if(document.getElementsByClassName('fixed_item_height').length > 0) {
                        document.getElementsByClassName('fixed_item_height')[0].style.height = '4.5rem';
                        document.getElementsByClassName('fixed_item_height')[1].style.height = '4.5rem';
                    }
                }else {
                    this.pageClassName = 'mobile_home_wrap';
                    this.module_item_wrap = 'module_item_wrap_mobile';
                    if(document.getElementsByClassName('fixed_item_height').length > 0) {
                        document.getElementsByClassName('fixed_item_height')[0].style.height = 'auto';
                        document.getElementsByClassName('fixed_item_height')[1].style.height = 'auto';
                    }
                }
            },
            onWindowResize () {
                this.changeEcharts()
            },
            changeEcharts() {
                let priceEcharts = echarts.init(document.getElementById('current_echarts'));
                let hsnEcharts = echarts.init(document.getElementById('hsn_echarts'));
                if(window.innerWidth <= 405) {
                    this.echartsMultiple = 1.25;
                    this.hsnEahartsDom.style.height = '.23rem'
                    this.hsnEahartsDom.style.width = '.83rem'
                    this.currentEahartsDom.style.height = '.23rem'
                    this.currentEahartsDom.style.width = '.83rem'
                    priceEcharts.resize();
                    hsnEcharts.resize();
                }else {
                    this.echartsMultiple = 1.01;
                    this.hsnEahartsDom.style.height = '.4rem'
                    this.hsnEahartsDom.style.width = '1.47rem'
                    this.currentEahartsDom.style.height = '.4rem'
                    this.currentEahartsDom.style.width = '1.47rem'
                    priceEcharts.resize();
                    hsnEcharts.resize();
                }
            },
            getPublic () {
                Service.commonInterface({public:{}},(item) =>{
                    if(item.code === '0') {
                        let data = item.data
                        this.price = data.price;
                        // this.price = Number(data.price).toFixed(2);
                        this.blockHeight = data.height;
                        this.blockTime = Number(data.block_time);
                        this.pledgeHsn = Tools.formatTransactions(data.pledge_hsn);
                        this.totalHsn = Tools.formatTransactions(data.total_hsn);
                        this.pledgeTotal = (data.pledge_hsn / data.total_hsn * 100).toFixed(2) + '%';
                        this.inflation = (data.inflation * 100).toFixed(2) + '%'
                    } else {
                        console.error(item.msg)
                    }

                })
            },
            getEcharts () {
                Service.commonInterface({drawing:{}}, (item) =>{
                    if(item.code === '0') {
                        let data = item.data;
                        this.priceEchartsData = data.price
                        this.hsnEchartsData = data.token
                        this.priceDiff = ((data.price[0] - data.price[9]) / data.price[9] * 100).toFixed(2)
                        this.hsnDiff = ((data.token[0] - data.token[23]) / data.token[23] * 100).toFixed(2)
                        this.initecharts()
                    }else {
                        console.error(item.msg)
                    }
                })
            },
            initecharts() {
                let that = this
                let priceEcharts = echarts.init(document.getElementById('current_echarts'));
                let hsnEcharts = echarts.init(document.getElementById('hsn_echarts'));
                let priceOption = {
                    xAxis: {
                        type: 'category',
                        show: false,
                        splitNumber:25,
                    },
                    yAxis: {
                        type: 'value',
                        show: false,
                        min: function(value) {
                            return value.min - (that.echartsMultiple*(value.max+value.min)/2 - value.min);
                        },
                        max: function(value) {
                            return value.max +  (that.echartsMultiple*(value.max+value.min)/2 - value.min);
                        }
                    },
                    color:'#9c6cff',
                    series:[{
                        data: this.priceEchartsData.reverse(),
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#e3d5ff' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'white' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        },
                        lineStyle: {
                            type: 'solid'
                        }
                    }]
                };
                let hsnOption = {
                    xAxis: {
                        type: 'category',
                        show: false,
                        splitNumber:25,
                    },
                    yAxis: {
                        type: 'value',
                        show: false,
                        min: function(value) {
                            return value.min - (that.echartsMultiple*(value.max+value.min)/2 - value.min);
                        },
                        max: function(value) {
                            return value.max +  (that.echartsMultiple*(value.max+value.min)/2 - value.min);
                        }
                    },
                    color:'#9c6cff',
                    series:[{
                        data: this.hsnEchartsData.reverse(),
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#e3d5ff' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'white' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            }
                        }
                    }]
                };
                priceEcharts.setOption(priceOption);
                hsnEcharts.setOption(hsnOption);
            },
            getBlock() {
                Service.commonInterface({blocks:{head: 0,page: 0, size: 0}}, (item) => {
                    if(item.code === '0'){
                        this.blocksInformation = [];
                        item.data.forEach(item => {
                            this.blocksInformation.push({
                                Proposer: item.proposer,
                                Height: item.height,
                                Txs: item.txs,
                                Time:Tools.formatDateYearAndMinutesAndSeconds(item.time),
                                ago: Tools.tranTime(item.time),

                            })
                        })
                        this.showLoading = false
                    }
                })
            },
            getTransactions() {
                Service.commonInterface({txs:{head: 0,page: 0, size: 0}}, (item) => {
                    if(item.code === '0'){
                        this.transactionInformation = [];
                        item.data.forEach(item => {
                            this.transactionInformation.push({
                                TxHash: item.hash,
                                Type: item.types,
                                Time: Tools.formatDateYearAndMinutesAndSeconds(item.time),
                                ago: Tools.tranTime(item.time),
                                Height: item.height,
                                Result: item.result
                            })
                        })
                        
                    }
                })
            },
        },
    }
</script>
<style lang="scss">
    @import '../style/mixin.scss';
    .home_wrap {
        @include flex();
        @include pcContainer;
        .headerImg {
            max-width: 19.2rem;
            width: 100%;
            display: flex;
            justify-content: center;
            position: relative;
            img {
                margin:0 auto;
                width: 100%;
                height: 100%;
            }
            .download_ios {
                position: absolute;
                top: 48.6%;
                width: 19.17%;
                height: 15%;
                cursor: pointer;
                .download_android_code,.download_ios_code {
                    position: relative;
                    left: 100%;
                    bottom: 120%;
                    width: 1.7rem;
                    z-index: 10;
                    display: none;
                }
            }
            .download_ios {
                left: 30%;
                &:hover {
                    .download_ios_code {
                        display: inline-block;
                    }
                }
            }
        }
        //pc端和移动端公共样式
        .personal_computer_home_wrap, .mobile_home_wrap {
            padding-top: 0.3rem;
            .information_preview {
                @include flex;
                margin-bottom: 0.3rem;
                .information_preview_module {
                    border-right: 1px solid #d6d9e0;
                    @include flex;
                    flex-direction: column;
                    align-items: center;
                    span:nth-child(1){
                        height: 0.27rem;
                    }
                    &:last-child {
                        border-right: none;
                    }
                    span {
                        &:first-child {
                            font-size: 0.18rem;
                            @include fontWeight;
                        }
                    }
                    .information_module_key {
                        font-size: 0.14rem;
                        color: #a2a2ae;
                    }
                }
            }
            .current_net_status_list{
                display: flex;
                width: 100%;
                box-shadow: 0px 2px 6px rgba(0,0,0,0.16);
                padding: 0.1px 0;
                min-height: 1.1rem;
                align-items:center;
                
                .item_status{
                    height: .8rem;
                    flex: 1;
                    background: #fff;
                    border-radius: 0.01rem;
                    box-sizing: border-box;
                    padding: 0 0.1rem;
                    
                    display: flex;
                    justify-content: space-between;
                    // flex-direction: column;
                    .item_status_left,.item_status_right {
                        flex: 1;
                        padding: 0 0.2rem;
                        border-right: 0.01rem solid #0294D7;
                        @include flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    .item_status_right {
                        &:last-child {
                            border-right: none;
                        }
                    }
                    .img_container{
                        .item_name{
                            font-size: 0.14rem;
                            color: #333;
                        }
                    }
                    .current {
                        display: flex;
                        justify-content: space-between;
                        // padding-top: 0.15rem;
                        align-items: flex-end;
                        // .current_img{
                        //     line-height: 0.23rem;
                        // }
                        #current_echarts,#hsn_echarts{
                            width:1.47rem;
                            height: 0.4rem;
                        }
                        .proposer_bottom {
                            display: inline-block;
                            width: 100%;
                            min-width:0.43rem;
                            text-align: center;
                            font-size: 0.1rem;
                            img {
                                margin-bottom: 0.02rem;
                                margin-right: 0.03rem;
                            }
                        }
                        .current_content{
                            height: 0.55rem;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            .proposer_top {
                                height: 0.22rem;
                                font-size: 0.2rem;
                            }
                            .proposer_num {
                                font-size: 0.12rem;
                            }
                            // .proposer_bottom {
                            //     img {
                            //         margin-bottom: 0.02rem;
                            //         margin-right: 0.03rem;
                            //     }
                            // }
                        }
                        .current_three {
                            position: relative;
                            bottom: 0.08rem;
                        }
                        .current_num {
                            color:#333;
                            font-size: 0.22rem;
                        }
                        .current_time {
                            font-size: 0.14rem;
                        }
                        .current_year {
                            font-size: 0.185rem;
                        }
                    }
                    
                }
            }
            //饼状图
            // .home_module_item_pie {
            //     height: 3.5rem;
            // }
        }
//PC -------------------------
        .personal_computer_home_wrap {
            width: 100%!important;
            padding: 0.2rem;
            
            @include pcCenter;
            .information_preview {
                .information_preview_module {
                    flex: 1;
                }
            }

            .module_item_wrap_computer {
                width: 100%;
                @include flex();
                justify-content: space-between;
                .home_module_item {
                    flex:1;
                    margin-bottom: 0.3rem;
                    height: 3.54rem;
                    &:nth-child(2n+1){
                        margin-right:0.2rem;
                    }
                }
                .fixed_item_height {
                    height: 4.5rem;
                }

            }
            

        }
        .mobile_home_wrap {
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            padding: 0.1rem;
            .information_preview {
                // overflow-x: auto;
                // -webkit-overflow-scrolling:touch;
                .current_net_status_list{
                    display: flex;
                    flex-direction: column;
                    height: 1.83rem;
                    padding: 0.1rem;
                    .item_status{
                        width: 100%;
                        font-size: 0.12rem;
                        border-radius: 0.01rem;
                        box-sizing: border-box;
                        &:nth-child(1) {
                            border-bottom: 0.01rem solid #80C9EB;
                            padding-bottom: 0.1rem;
                        }
                        .item_status_right, .item_status_left {
                            padding: 0;
                            border-right: none;
                            &:nth-child(2) {
                                flex:.55
                            }
                            .img_container {
                                padding: 0 0.1rem;
                            }
                            .current {
                                .proposer_top,.current_num {
                                    font-size: 0.14rem;
                                }           
                                .current_content {
                                    padding-right: 0.1rem;   
                                    border-right: 0.01rem solid #0294D7;
                                }
                                
                            }
                        }
                    }
                }
            }
            .module_item_wrap_mobile {
                @include flex();
                flex-direction: column;
                align-items: center;
                .home_module_item {
                    width: 100%;
                    margin-bottom: 0.4rem;
                    // border: 0.01rem solid #d6d9e0;
                }
                .home_module_item_pie {
                    overflow-x: auto;
                    -webkit-overflow-scrolling:touch;
                }
            }
        }
        .home_module_item_status {
            padding: 0.1rem;
            background: #3190e8;

            .current_block {
                @include fontWeight;
                color: #fff;
                display: inline-block;
                height: 0.28rem;
                line-height: 0.28rem;
                border-bottom: 0.01rem solid #ffffff;
                width: 100%;

            }
            .home_status_bottom {
                @include flex();

                .home_status_bottom_content {
                    flex: 1;
                    @include flex();
                    flex-direction: column;
                    span {
                        font-size: 0.14rem;
                        color: #ffffff;
                        font-weight: normal;
                    }
                }

            }
        }
    }
    .blocks_background_type{
        background: url('../assets/block.png') no-repeat 0 0.02rem;
        text-indent:0.2rem;
        color:#3598db;
    }
    .home_module_transaction_title_wrap{
        @include flex;
        padding:0.2rem;
        height:0.64rem;
        justify-content: space-between;
        background: #efeff1;
        border-bottom:1px solid #e4e4e4;
        align-items: center;
        .home_module_transaction_title{
            font-size:0.18rem;
            @include fontWeight;
        }
        .blocks_background{
            background: url('../assets/blocks.png') no-repeat 0 0.02rem;
            text-indent:0.35rem;
        }
        .transactions_background{
            background: url('../assets/transactions.png') no-repeat 0 0.02rem;
            text-indent:0.3rem;
        }
        .view_all_btn{
            @include viewBtn;
        }
    }
    .transaction_title_name{
        padding-left: 0.1rem;
    }
    .transactions_background_type{
        background: url('../assets/transactions.png') no-repeat 0 0.02rem;
        text-indent:0.2rem;
    }
    pre{
        margin: 0!important;
    }
    .animation{
        @include fadeInAnimation
    }
    .latest_block_content:hover{
        cursor: pointer;
    }
    .proposer_top{
        cursor: pointer;
        a{
            color:#333 !important;
        }
    }
</style>

<template>
    <div class="dash_header" >
        <ul class="dash_header_content" :class="isMobile?'dash_header_content_mobile':''">
            <li>
                <div class="dash_header_list">
                    <div class="dash_header_content_top"><img src="../../assets/v-block.png" alt="">  Height</div>
                    <div class="dash_header_content_bottom">
                        <p></p>
                        <p>{{blockHeight}}</p>
                    </div>
                </div>
                <div class="dash_header_list" v-if="!item">
                    <div class="dash_header_content_top"><img src="../../assets/user.png" alt="">  Validators</div>
                    <div class="dash_header_content_bottom">
                        <p></p>
                        <p>{{vaildtor}}</p>
                    </div>
                </div>
                <div class="dash_header_list" v-else>
                    <div class="dash_header_content_top"><img src="../../assets/price.png" alt="">  Price</div>
                    <div class="dash_header_content_bottom">
                        <p></p>
                        <p>$ {{price}}</p>
                    </div>
                </div>
            </li>
            <li>
                <div class="dash_header_list">
                    <div class="dash_header_content_top"><img src="../../assets/money.png" alt="">  HSN</div>
                    <div class="dash_header_content_bottom">
                        <p></p>
                        <p> {{hsnToken}} </p>
                    </div>
                </div>
                <div class="dash_header_list">
                    <div class="dash_header_content_top"><img src="../../assets/time.png" alt="">  Block Time</div>
                    <div class="dash_header_content_bottom">
                        <p></p>
                        <p>{{blockTime}}s</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import Service from "../../service"
import Tools from '../../util/Tools'
export default {
    name: "MdashBoard",
    props:['item'],
    data(){
        return {
            blockHeight:'',
            vaildtor:'',
            hsnToken:'',
            blockTime:'',
            price:'',
            isMobile:this.$store.state.isMobile,
            timer: null,
        }
    },
    beforeMount() {
        // window.addEventListener('resize',this.onWindowResize);
    },
    watch: {
        '$store.state.isMobile'(newVal, oldVal) {
            this.onresize(newVal);
        }
    },
    mounted() {
        this.getPublic()
        this.timer = setInterval(() =>{
            this.getPublic()
        },6000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        onresize() {
            this.isMobile = this.$store.state.isMobile
        },
        getPublic () {
            Service.commonInterface({public:{}},(item) =>{
                if(item.code === '0') {
                    let data = item.data
                    this.price = Number(data.price).toFixed(2);
                    this.blockHeight = data.height;
                    this.blockTime = data.block_time.toFixed(2);
                    this.hsnToken =  Tools.formatTransactions(data.pledge_hsn) + '/' + Tools.formatTransactions(data.total_hsn);
                    this.blockTime = data.block_time.toFixed(2);
                    this.vaildtor = data.online_validators + '/' + data.total_validators
                    
                } else {
                    console.error(item.msg)
                }

            })
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin.scss';

.dash_name, .dash_header,.dash_header_content {
    background: white;
    max-width: 12rem;
    width:100%;
}
.dash_header_content {
    min-height: 1.1rem;
    padding: 0.1rem 0;
    box-shadow:0px 2px 6px rgba(0,0,0,0.16);
    border-radius: 0.1rem;
    @include flex;
    justify-content: space-around;
    li {
        max-width: 6rem;    
        width: 100%;
        @include flex;
        justify-content: space-between;
        .dash_header_list{
            max-width: 6rem;    
            width: 100%;
            padding: 0 0.2rem;
            border-right: 1px solid #0294D7;
            
            @include flex;
            flex-direction: column;
            justify-content: space-between;
            .dash_header_content_top {
                font-size: 0.14rem;
                line-height: 0.3rem;
            }
            .dash_header_content_bottom {
                @include flex;
                justify-content: space-between;
                align-items: flex-end;
                
                p {
                    font-size: 0.26rem;
                }
            }
        }
        &:nth-of-type(2) {
            .dash_header_list:nth-of-type(2) {
                border-right: none;
            }
        }
    }
}
.dash_header_content_mobile {
    li {
        flex-direction: column;
        padding-left: .1rem;
        .dash_header_list {
            padding: 0.1rem 0;
            border-right: none !important;
            .dash_header_content_top,.dash_header_content_bottom {
                padding: 0 .1rem;
            }
            .dash_header_content_bottom {
                border-right: .01rem solid rgba(2,148,215,1);   
            }
            &:nth-of-type(1) {
                border-bottom: .01rem solid #80C9EB;

            }
        }
        &:nth-of-type(2) {
            padding-left:0;
            padding-right: .1rem;
            .dash_header_content_bottom {
                border-right: none;                
            }
        }
    }
}
</style>

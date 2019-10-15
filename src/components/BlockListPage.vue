<template>
    <div
        class="blocks_list_page_container"
        :class="[$store.state.isMobile ? 'mobile_blocks_list_page_container' : 'blocks_list_page_container_fixed']"
    >
        <div class="block_list_container">
            <div class="block_list_content">
                <div class="page_nav_container">
                    <span>
                        Blocks
                    </span>
                </div>
                <m-dash-board :item="'Block'"></m-dash-board>
                <div class="block_list_table_container">
                    <spin-component :showLoading="flShowLoading"></spin-component>
                    <div style="margin: 0 .1rem;overflow-x: auto; overflow-y: hidden;">
                        <m-block-list-page-table :items="items"></m-block-list-page-table>
                    </div>
                    <div v-show="showNoData" class="no_data_show">No Data</div>
                </div>
                <div class="pagination_footer_container">
                    <m-pagination
                        :ascending="false"
                        :page-size="size"
                        :total="currentHeight"
                        :page-change="pageChange"
                        :range="range"
                    ></m-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Service from "../service";
import Tools from "../util/Tools";
import SpinComponent from "./commonComponents/SpinComponent";
import BlockListPageTable from "./table/BlockListPageTable";
import MBlockListPageTable from "./table/MBlockListPageTable";
import MPagination from "./commonComponents/MPagination";
import MDashBoard from './commonComponents/MdashBoard'

export default {
    name: "blockListPage",
    components: {
        SpinComponent,
        BlockListPageTable,
        MBlockListPageTable,
        MPagination,
        MDashBoard
    },
    data() {
        return {
            page: 0,
            size: 13,
            currentHeight: sessionStorage.getItem("blockListTotal")
                ? Number(sessionStorage.getItem("blockListTotal"))
                : 0,
            items: [],
            showNoData: false,
            timer: null,
            flShowLoading: false,
            range: [],
            currentPageNumCache: 0,
            isoMunted: false,
            network: false,
        };
    },
    watch: {
        $route(newVal) {
            this.isoMunted = false;
        }
    },
    mounted() {
        this.getBlockList();
        this.flShowLoading = true;
        this.timer = setInterval(()=>{
            this.getBlockList()
        },6000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        pageChange(pageNum) {
            this.page = pageNum - 1;
            this.getBlockList();
        },
        getBlockList() {
            this.showNoData = false;
            Service.commonInterface(
                {
                    blocks: {
                        head: 0,
                        page: this.page,
                        size: this.size,
                    }
                },
                data => {
                    try {
                        if (data.code === "0") {
                            this.flShowLoading = false;
                            let that = this;
                            this.items = data.data.map(item => {

                                    return {
                                        height: item.height,
                                        blockHash: item.block_hash,
                                        proposer: item.aka,
                                        address: item.proposer,
                                        Age: item.time?Tools.tranTime(item.time) + ' ago':'',
                                        txs: item.txs,
                                    };
                            });
                            this.currentHeight = data.total;
                            //最后一页数据会多出来很多height为0的数据, 需要筛选掉 start --------
                            let length = 0
                            this.items.forEach(item => {
                                if(item.height == 0){
                                    length++
                                }
                            })
                            this.items.length = 13 - length
                            // end ------------------------------- --------

                            let heightArr = this.items.map(v => v.height);
                            this.range = [
                                Math.max.apply(null, heightArr),
                                Math.min.apply(null, heightArr)
                            ];
                           
                        } else {
                            this.items = [];
                            this.showNoData = false;
                        }
                    } catch (e) {
                        this.flShowLoading = true;
                        this.items = [];
                        this.showNoData = false;
                    }
                }
            );
        }
    },
    
};
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
.blocks_list_page_container {
    padding: .1rem;
    .block_list_container {
        max-width: 12rem;
        margin: 0 auto;
        .block_list_content {
            .page_nav_container {
                display: flex;
                justify-content: space-between;
                height: 0.7rem;
                align-items: center;
                z-index: 5;
                .skip_route {
                    margin-left: 0.09rem;
                    a {
                        color: #3598db !important;
                        cursor: pointer;
                    }
                }
                span {
                    font-size: 0.22rem;
                    color:#0294D7;
                }
                .pagination_container {
                    font-size: 0.14rem;
                }
            }
            .block_list_table_container {
                margin: .2rem 0;
                padding: .1rem;
                // overflow-x: auto;
                // overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                box-shadow:0px 2px 6px rgba(0,0,0,0.16);
            }
            .pagination_footer_container {
                display: flex;
                justify-content: flex-end;
                height: 0.4rem;
                align-items: center;
                margin-bottom: 0.2rem;
                font-size: 0.14rem;
            }
            .no_data_show {
                display: flex;
                justify-content: center;
                border-top: 0.01rem solid #eee;
                border-bottom: 0.01rem solid #eee;
                font-size: 0.14rem;
                height: 3rem;
                align-items: center;
            }
        }
    }
}
.mobile_blocks_list_page_container {
    .block_list_container {
        padding: 0 0.1rem;
    }
}
.blocks_list_page_container_fixed {
    div.block_list_title_container {
        // position: fixed;
    }
    .page_nav_container {
        // position: fixed;
        width: 100%;
        max-width: 12rem;
        background-color: #ffffff;
    }
    .block_list_table_container {
        margin-top:0.2rem;
        padding: 0.2rem;
        box-shadow:0px 2px 6px rgba(0,0,0,0.16);
    }
}
@media screen and (max-width: 910px) {
    .page_nav_container {
        padding-left: 0.1rem !important;
    }
}

</style>

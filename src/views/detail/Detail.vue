<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" />
    <scroll
      class="content"
      ref="scroll"
      :data="[topImages, goods, shop, detailInfo, paramInfo]"
      :probe-type="3"
    >
      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        ref="param"
        :param-info="paramInfo"
      ></detail-param-info>
      <detail-comment-info
        ref="comment"
        :comment-info="commentInfo"
      ></detail-comment-info>
      <detail-recommend-info
        ref="recommend"
        :recommend-list="recommendList"
      ></detail-recommend-info>
    </scroll>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";
import { getDetail, getRecommend, Goods, Shop, GoodsParam } from "network/detail";

import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailRecommendInfo from "./childComps/DetailRecommendInfo";

export default {
  name: "Detail",
  components: {
    Scroll,
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailRecommendInfo
  },
  data() {
    return {
      id: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendList: []
    };
  },
  created() {
    
    this._getDetailData();
    this._getRecommend();
  },

  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
    },

    _getDetailData() {
      // 1.获取iid
      this.id = this.$route.params.id;


      // 2.请求数据
      getDetail(this.id).then(res => {
        // 2.1.获取结果
        const data = res.result;

        // 2.2.获取顶部信息
        this.topImages = data.itemInfo.topImages;

        // 2.3.获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );

        // 2.4.获取店铺信息
        this.shop = new Shop(data.shopInfo);

        // 2.5.获取商品信息
        this.detailInfo = data.detailInfo;

        // 2.6.保存参数信息
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );

        // 2.7.保存评论信息
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }
      });
    },
    _getRecommend() {
      getRecommend().then((res, error) => {
        if (error) return;
        this.recommendList = res.data.list;
      });
    }
  }
};
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.detail-nav {
  position: relative;
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 60px;
}
</style>

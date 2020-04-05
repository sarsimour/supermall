<template>
  <div id="detail">
    <detail-nav-bar
      ref="detailnav"
      class="detail-nav"
      @titleClick="titleClick"
    />
    <scroll
      class="content"
      ref="scroll"
      :data="[topImages, goods, shop, detailInfo, paramInfo]"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
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
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="mbackTop" v-show="showBackTop"> </back-top>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";
import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam
} from "network/detail";
import { itemListenerMixin, backTopMixin } from "common/mixin";
import { BACKTOP_DISTANCE } from "common/const";
import { debounce } from "common/utils";

import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailRecommendInfo from "./childComps/DetailRecommendInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
import BackTop from "components/content/backTop/BackTop";

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
    DetailRecommendInfo,
    DetailBottomBar,
    BackTop
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendList: [],
      themeTops: [],
      getOffsetTops: null,
      loadevent: 'itemImageLoad'
    };
  },
  created() {
    this._getDetailData();
    this._getRecommend();

    // // 监听点击商品图片的事件
    // this.$bus.$on("detailChange", ()=>{
    //   console.log('detailchange')
    //   this._getDetailData();
    // this._getRecommend();});
    this.getOffsetTops = debounce(this._getOffsetTops, 100);
  },

  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getOffsetTops();
    },

    addToCart() {
      // 1.创建对象
      const obj = {};
      // 2.对象信息
      obj.iid = this.iid;
      obj.imgURL = this.topImages[0];
      obj.title = this.goods.title;
      obj.desc = this.goods.desc;
      obj.newPrice = this.goods.nowPrice;
      // 3.添加到Store中
      this.$store.commit("addCart", obj);
    },

    contentScroll(position) {
      // 1.监听backTop的显示
      this.showBackTop = position.y < -BACKTOP_DISTANCE;
      // 2.监听滚动到哪一个主题
      let currentIndex = 0;
      currentIndex = this._listenScrollTheme(-position.y);
      this.$refs.detailnav.currentIndex = currentIndex;
    },
    _listenScrollTheme(position) {
      let length = this.themeTops.length;
      let currentIndex = 0;
      for (let i = 0; i < length; i++) {
        let iPos = this.themeTops[i];
        /**
         * 判断的方案:
         *  方案一:
         *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
         *    优点: 不需要引入其他的内容, 通过逻辑解决
         *    缺点: 判断条件过长, 并且不容易理解
         *  方案二:
         *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
         *    优点: 简洁明了, 便于理解
         *    缺点: 需要引入一个较大的int数字
         * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
         * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
         */
        if (position >= iPos && position < this.themeTops[i + 1]) {
          // if (this.currentIndex !== i) {
          //   this.currentIndex = i;
          // }
          currentIndex = i;
          break;
        }
      }
      return currentIndex;
    },

    _getOffsetTops() {
      this.themeTops = [];
      this.themeTops.push(0);
      this.themeTops.push(this.$refs.param.$el.offsetTop);
      this.themeTops.push(this.$refs.comment.$el.offsetTop);
      this.themeTops.push(this.$refs.recommend.$el.offsetTop);
      this.themeTops.push(Number.MAX_VALUE);
    },

    _getDetailData() {
      // 1.获取iid
      this.iid = this.$route.params.iid;

      // 2.请求数据
      getDetail(this.iid).then(res => {
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
    },

    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTops[index], 100);
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

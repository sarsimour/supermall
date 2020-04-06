<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
        class="tab-control"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2" v-show="isTabFixed"
      />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swipperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        class="tab-control"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl1"
      />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import {itemListenerMixin} from 'common/mixin';

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      indtype: {0: 'pop', 1: 'new', 2: 'sell'},
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      savedY: {pop: 0, new: 0, sell: 0},
      loadevent: 'itemImageLoad'
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },

  activated() {
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.savedY[this.currentType], 0);

    this.$bus.$on("itemImageLoad", this.itemImgListener);
  },

  deactivated() {
    this.savedY[this.currentType] = this.$refs.scroll.getScrollY()

    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },

  methods: {
    /**
     * 事件监听相关的方法
     */



    tabClick(index) {

      // 切换时记录旧类型的滚动位置
      if (this.indtype[index] != this.currentType) {
        this.savedY[this.currentType] = Math.min(this.$refs.scroll.getScrollY(), -this.tabOffsetTop);
        this.currentType = this.indtype[index];
      }
      
      // switch (index) {
      //   case 0:
      //     this.currentType = "pop";
      //     this.savedY[this.currentType] = this.$refs.scroll.getScrollY();
      //     break;
      //   case 1:
      //     this.currentType = "new";
      //     this.savedY[this.currentType] = this.$refs.scroll.getScrollY();
      //     break;
      //   case 2:
      //     this.currentType = "sell";
      //     this.savedY[this.currentType] = this.$refs.scroll.getScrollY();
      //     break;
      // }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
      // this.$refs.scroll.scrollTo(0, -this.tabOffsetTop);
      this.$refs.scroll.scrollTo(0, this.savedY[this.currentType]);
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    contentScroll(position) {
      this.isShowBackTop = -position.y > 1000;
      this.isTabFixed = (-position.y) > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
      this.$refs.scroll.finishPullUp();
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl1.$el.offsetTop;
      this.savedY = {pop: -this.tabOffsetTop, new: -this.tabOffsetTop, sell: -this.tabOffsetTop};
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        
      });
    }
  }
};
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

}

.tab-control {
  position: relative;
  z-index: 9;
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/*.content {*/
/*height: calc(100% - 93px);*/
/*overflow: hidden;*/
/*margin-top: 44px;*/
/*}*/
</style>

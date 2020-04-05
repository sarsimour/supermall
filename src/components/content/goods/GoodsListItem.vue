<template>
  <div class="goods-item" @click="goToDetail">
    <img :src="getImg" alt="" @load="imageLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      emitroute: false
    }
  },
  computed: {
    getImg() {
      return (
        this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
      );
    }
  },
  watch: {
    // TODO 有问题 需要修改 当然目前后端没有返回需要的数据也是问题
    //监听相同路由下参数变化的时候，从而实现异步刷新
    $route() {
      const tmp = this.$route.path.split("/");
      if (tmp[1] == 'detail' &&  !this.emitroute) {
        console.log('detailchange now')
        this.emitroute = true;
        this.$bus.$emit("detailChange");
      }
    }
  },

  methods: {
    imageLoad() {
      this.$bus.$emit("itemImageLoad");
    },
    goToDetail: function() {
      // 1.获取iid
      let iid = this.goodsItem.iid || this.goodsItem.item_id;

      // 2.跳转到详情页面
      this.$router.push({ path: "/detail/" + iid });
    }
  }
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;

  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>

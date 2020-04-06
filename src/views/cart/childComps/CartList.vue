<template>
  <scroll ref="scroll" class="scroll">
      <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item" @cartItemImageLoad="refresh"></cart-list-item>
  </scroll>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll';
import CartListItem from "./CartListItem";

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  props: {
    cartList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.scroll.refresh()
    }
  },
};
</script>

<style scoped>
.scroll {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 93px;
  left: 0;
  right: 0;
}
</style>
